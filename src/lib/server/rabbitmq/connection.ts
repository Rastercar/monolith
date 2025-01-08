import amqp, { type Channel, type Connection, type ConsumeMessage, type Options } from 'amqplib';
import consola from 'consola';
import { handleH02TrackerPosition } from '../tracking/h02/position';
import {
	DEFAULT_EXCHANGE,
	MAILER_QUEUE,
	TRACKER_EVENTS_EXCHANGE,
	TRACKER_EVENTS_QUEUE
} from './constants';
import { getRmqConnectionErrorInfo } from './rmq-helpers';
import { VEHICLE_TRACKER_IMEI_TO_ID_CACHE } from './tracker-event-handlers';

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

	constructor(connetionUrl: string) {
		this.connetionUrl = connetionUrl;
		this.connect();
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
			consola.info(`[RMQ] connected`);

			// create needed queues, exchanges and bindings
			await this.declareQueues().catch(this.handleFatalError);
			await this.declareExchanges().catch(this.handleFatalError);
			await this.bindQueuesAndExchanges().catch(this.handleFatalError);

			// start consuming tracker events
			this.startTrackerEventsConsumer();
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
			consola.error(`[RMQ] connection failed with code: ${code}`);
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
		consola.error('[RMQ] unknown FATAL error', error);
	}

	/**
	 * Tiny wrapper aroung amqpChannel.publish
	 *
	 * TODO: set tracing headers here !
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

	private startTrackerEventsConsumer() {
		this.consume(
			TRACKER_EVENTS_QUEUE,
			(delivery) => {
				// if the delivery is null, the consumer is canceled or the connection
				// is closed we cant do anything so just return
				if (!delivery) return;

				// tracking events routing keys have the following pattern
				// {protocol}.{type}.{imei}
				//
				// - protocol: the original protocol of the tracker
				// - type: eventy type, eg: "position", "alert", "heartbeat"
				// - imei: the tracking device IMEI
				const routingKey = delivery.fields.routingKey;

				const routingKeyFields = routingKey.split('.');

				if (routingKeyFields.length < 3) {
					consola.error('[RMQ] invalid tracker event routing key');
					return;
				}

				const [protocol, eventType, imei] = routingKeyFields;

				if (!protocol || !eventType || !imei) {
					consola.error('[RMQ] empty tracker event routing key');
					return;
				}

				const protocolAndEvent = `${protocol}.${eventType}`;

				if (protocolAndEvent !== 'h02.location') {
					consola.info(`[RMQ] unknown protocol/event combination: ${protocol}/${eventType}`);
					return;
				}

				VEHICLE_TRACKER_IMEI_TO_ID_CACHE.get(imei).then((trackerId) => {
					if (!trackerId) {
						consola.warn(`[RMQ] tracker of imei: ${imei} not found`);
						return;
					}

					handleH02TrackerPosition(trackerId, delivery.content);
				});
			},
			{
				// automatically acknowledge messages
				noAck: true,
				consumerTag: 'monolith_tracker_events_consumer'
			}
		);
	}
}
