import { env } from '$lib/env/private-env';
import type { Options } from 'amqplib';
import { RabbitMQConnection } from './connection';
import { DEFAULT_EXCHANGE, MAILER_QUEUE, type TRACKER_EVENTS_QUEUE } from './constants';

type queue = typeof TRACKER_EVENTS_QUEUE | typeof MAILER_QUEUE;

/**
 * rabbitmq connection singleton
 */
let rmqConnection: RabbitMQConnection | null = null;

const getRmqConnection = () => {
	if (!rmqConnection) rmqConnection = new RabbitMQConnection(env.RABBITMQ_URL, true);
	return rmqConnection;
};

/**
 * Publishes directly to a queue using the default exchange, JSON.stringify the content
 * and sets contentType to `application/json`
 */
export async function publishJsonToQueue(
	queue: queue,
	content: unknown,
	options: Omit<Options.Publish, 'contentType'>
) {
	return getRmqConnection().publish(DEFAULT_EXCHANGE, queue, JSON.stringify(content), {
		...options,
		contentType: 'application/json'
	});
}

/**
 *
 */
export const initRabbitMq = () => {
	rmqConnection = new RabbitMQConnection(env.RABBITMQ_URL, true);
};
