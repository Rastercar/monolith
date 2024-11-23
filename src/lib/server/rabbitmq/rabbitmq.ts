import { env } from '$lib/private-env';
import type { Options } from 'amqplib';
import { RabbitMQConnection } from './connection';
import { DEFAULT_EXCHANGE, MAILER_QUEUE, type TRACKER_EVENTS_QUEUE } from './constants';

type queue = typeof TRACKER_EVENTS_QUEUE | typeof MAILER_QUEUE;

/**
 * rabbitmq connection singleton
 */
export const rmqConnection = new RabbitMQConnection(env.RABBITMQ_URL);

/**
 * Publishes directly to a queue using the default exchange, JSON.stringify the content
 * and sets contentType to `application/json`
 */
export async function publishJsonToQueue(
	queue: queue,
	content: unknown,
	options: Omit<Options.Publish, 'contentType'>
) {
	return rmqConnection.publish(DEFAULT_EXCHANGE, queue, JSON.stringify(content), {
		...options,
		contentType: 'application/json'
	});
}

/** noop to load the RabbitMQ connection */
export const initRabbitMq = () => null;
