import amqp, { type Channel, type Connection, type ConsumeMessage, type Options } from 'amqplib';
import consola from 'consola';
import {
	DEFAULT_EXCHANGE,
	MAILER_QUEUE,
	TRACKER_EVENTS_EXCHANGE,
	TRACKER_EVENTS_QUEUE
} from './constants';
import { trackerEventsConsumer } from './consumers';
import { getRmqConnectionErrorInfo } from './rmq-helpers';

type RmqConsumeCallback = (_: ConsumeMessage | null) => void;

/**
 * Max RabbitMQ reconnection attempts
 */
const MAX_RECONNECTION_ATTEMPTS = 10;

export class RabbitMQConnection {
	/**
	 * AQMP connection
	 */
	connection: Connection | null = null;

	/**
	 * Channel to be used exclusively to publish messages
	 */
	publishChannel: Channel | null = null;

	/**
	 * Channel to be used exclusively to consume messages
	 */
	consumeChannel: Channel | null = null;

	/**
	 * eg: amqp://localhost:5672
	 */
	connetionUrl!: string;

	/**
	 * number of the current reconnection attempt
	 *
	 * this is cleared on a succesfull reconnection
	 */
	reconectionAttempt = 0;

	/**
	 * NodeJS timeout of the next reconnection attempt
	 */
	reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

	constructor(connetionUrl: string, autoConnect = true) {
		this.connetionUrl = connetionUrl;
		if (autoConnect) this.connect();
	}

	async connect() {
		const isReconectionAttempt = this.reconectionAttempt > 0;

		if (isReconectionAttempt) {
			const ts = new Date().toLocaleString();
			consola.info(`[RMQ] ${ts} reconnecting to RabbitMQ, attempt: ${this.reconectionAttempt}`);
		} else {
			consola.info(`[RMQ] connecting to RabbitMQ`);
		}

		try {
			this.connection = await amqp.connect(`${this.connetionUrl}?heartbeat=${15}`);
			this.connection.on('error', (e) => this.handleConnectionError(e));
			this.connection.on('close', () => this.onConnectionClosed());

			this.publishChannel = await this.connection.createChannel();
			this.consumeChannel = await this.connection.createChannel();

			this.reconectionAttempt = 0;
			consola.info('[RMQ] connected');

			// create needed queues, exchanges and bindings
			await this.declareQueues().catch(this.reportFatalError);
			await this.declareExchanges().catch(this.reportFatalError);
			await this.bindQueuesAndExchanges().catch(this.reportFatalError);

			// start consuming tracker events
			this.startConsumers();
		} catch (error) {
			this.handleConnectionError(error);
		}
	}

	async onConnectionClosed() {
		this.connection = null;
		this.publishChannel = null;
		this.consumeChannel = null;

		return this.connect();
	}

	async bindQueuesAndExchanges() {
		if (!this.publishChannel) return;

		consola.info('[RMQ] tracker events queue binded to tracker events exchange');
		await this.publishChannel.bindQueue(TRACKER_EVENTS_QUEUE, TRACKER_EVENTS_EXCHANGE, '#');
	}

	async declareExchanges() {
		if (!this.publishChannel) return;

		consola.info('[RMQ] declaring TRACKER_EVENTS_EXCHANGE');
		await this.publishChannel.assertExchange(TRACKER_EVENTS_EXCHANGE, 'topic', {
			durable: true,
			internal: false,
			autoDelete: false
		});
	}

	async declareQueues() {
		if (!this.publishChannel) return;

		consola.info('[RMQ] declaring TRACKER_EVENTS_QUEUE');
		await this.publishChannel.assertQueue(TRACKER_EVENTS_QUEUE, {
			exclusive: false,
			durable: false,
			autoDelete: true
		});

		consola.info('[RMQ] declaring MAILER_QUEUE');
		await this.publishChannel.assertQueue(MAILER_QUEUE, {
			durable: true,
			exclusive: false,
			autoDelete: false,
			// Mailer Queue TTL
			//
			// Its VERY important to have a short TTL for the mailer queue, otherwise
			// if the service fails for some reason, and consumers keep retrying the
			// mailer queue might fill up with `sendEmail` requests and when the service
			// comes back up it will send tons of duplicated emails
			arguments: { 'x-message-ttl': 30_000 }
		});
	}

	/**
	 * handles rabbitmq connection errors, attempting to reconnect
	 * if it makes sense to do so according to the error
	 */
	async handleConnectionError(error: unknown) {
		this.connection = null;

		if (this.reconectionAttempt > MAX_RECONNECTION_ATTEMPTS) {
			return this.reportFatalError(error);
		}

		const { shouldRetry, code } = getRmqConnectionErrorInfo(error);

		if (!shouldRetry) {
			return this.reportFatalError(error);
		}

		// first reconnection attempt in 5 seconds, second in 4, third in 6...
		const timeout = this.reconectionAttempt * 2_000;

		// If there was already a reconnection attempt "queued" delete it
		if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);

		// Queue the reconnection attemp
		this.reconnectTimeout = setTimeout(() => {
			consola.error(`[RMQ] connection failed with code: ${code}`);
			this.connect();
			this.reconectionAttempt++;
		}, timeout);
	}

	/**
	 * [PROD-TODO] here we are just logging to STOUT, this means
	 * every feature dependingon rabbitmq will break, we should
	 * somehow notify infra by email, sms or whatever to check this error
	 */
	reportFatalError(error: unknown) {
		consola.error('[RMQ] fatal error', error);
	}

	/**
	 * Tiny wrapper aroung amqpChannel.publish
	 */
	publish(
		exchange = DEFAULT_EXCHANGE,
		routingKey: string,
		content: Parameters<typeof Buffer.from>[0],
		options?: Options.Publish
	) {
		if (!this.publishChannel) return;

		return this.publishChannel.publish(exchange, routingKey, Buffer.from(content), options);
	}

	consume(queue: string, cb: RmqConsumeCallback, opts: Options.Consume) {
		if (!this.consumeChannel) return;
		this.consumeChannel.consume(queue, cb, opts);
	}

	private startConsumers() {
		this.consume(
			trackerEventsConsumer.queue,
			trackerEventsConsumer.handler,
			trackerEventsConsumer.options
		);
	}
}
