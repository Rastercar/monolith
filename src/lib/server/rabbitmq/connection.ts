import amqp, { type Channel, type Connection, type Options } from 'amqplib';
import {
	DEFAULT_EXCHANGE,
	MAILER_QUEUE,
	TRACKER_EVENTS_EXCHANGE,
	TRACKER_EVENTS_QUEUE
} from './constants';
import { getRmqConnectionErrorInfo } from './rmq-helpers';

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

	constructor(connetionUrl: string) {
		this.connetionUrl = connetionUrl;
		this.connect();
	}

	async connect() {
		const isReconectionAttempt = this.reconectionAttempt > 0;

		if (isReconectionAttempt) {
			const ts = new Date().toLocaleString();
			console.log(`[RMQ] ${ts} reconnecting to RabbitMQ, attempt: ${this.reconectionAttempt}`);
		} else {
			console.log(`[RMQ] connecting to RabbitMQ`);
		}

		try {
			this.connection = await amqp.connect(`${this.connetionUrl}?heartbeat=${15}`);
			this.connection.on('error', (e) => this.handleConnectionError(e));
			this.connection.on('close', () => this.onConnectionClosed());

			this.publishChannel = await this.connection.createChannel();
			this.consumeChannel = await this.connection.createChannel();

			this.reconectionAttempt = 0;
			console.log(`[RMQ] connected`);

			// create needed queues, exchanges and bindings
			await this.declareQueues().catch(this.handleFatalError);
			await this.declareExchanges().catch(this.handleFatalError);
			await this.bindQueuesAndExchanges().catch(this.handleFatalError);
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

		console.log('[RMQ] tracker events queue binded to tracker events exchange');
		await this.publishChannel.bindQueue(TRACKER_EVENTS_QUEUE, TRACKER_EVENTS_EXCHANGE, '#');
	}

	async declareExchanges() {
		if (!this.publishChannel) return;

		console.log('[RMQ] declaring TRACKER_EVENTS_EXCHANGE');
		await this.publishChannel.assertExchange(TRACKER_EVENTS_EXCHANGE, 'topic', {
			durable: true,
			internal: false,
			autoDelete: false
		});
	}

	async declareQueues() {
		if (!this.publishChannel) return;

		console.log('[RMQ] declaring TRACKER_EVENTS_QUEUE');
		await this.publishChannel.assertQueue(TRACKER_EVENTS_QUEUE, {
			exclusive: false,
			durable: false,
			autoDelete: true
		});

		console.log('[RMQ] declaring MAILER_QUEUE');
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
			return this.handleFatalError(error);
		}

		const { shouldRetry, code } = getRmqConnectionErrorInfo(error);

		if (!shouldRetry) {
			return this.handleFatalError(error);
		}

		// first reconnection attempt in 5 seconds, second in 4, third in 6...
		const timeout = this.reconectionAttempt * 2_000;

		// If there was already a reconnection attempt "queued" delete it
		if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);

		// Queue the reconnection attemp
		this.reconnectTimeout = setTimeout(() => {
			console.log(`[RMQ] connection failed with code: ${code}`);
			this.connect();
			this.reconectionAttempt++;
		}, timeout);
	}

	/**
	 * [TODO-PROD] this is pretty fucking bad, every feature depending
	 * on rabbitmq will break, we should somehow notify infra by email,
	 * sms or whatever to check this error
	 */
	async handleFatalError(error: unknown) {
		console.error('[RMQ] unknown FATAL error', error);
	}

	/**
	 * Tiny wrapper aroung amqpChannel.publish
	 *
	 * TODO: set tracing headers here !
	 */
	async publish(
		exchange = DEFAULT_EXCHANGE,
		routingKey: string,
		content: Parameters<typeof Buffer.from>[0],
		options?: Options.Publish
	) {
		if (!this.publishChannel) return;
		return this.publishChannel.publish(exchange, routingKey, Buffer.from(content), options);
	}
}
