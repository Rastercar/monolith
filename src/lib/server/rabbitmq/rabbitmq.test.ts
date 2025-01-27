import { expect, test, vi } from 'vitest';
import { DEFAULT_EXCHANGE } from './constants';
import { getRmqConnection, initRabbitMq, publishJsonToQueue } from './rabbitmq';

vi.mock('./connection', () => {
	class RmqConMock {
		publish = vi.fn();
	}

	return {
		RabbitMQConnection: RmqConMock
	};
});

test('initRabbitMq - initializes rabbitmq connection singleton', () => {
	initRabbitMq();
	const instance = getRmqConnection();

	expect(instance).toBeDefined();
});

test('getRmqConnection - initializes and returns a RabbitMQConnection singleton', () => {
	const instance = getRmqConnection();
	const instanceTwoShouldBeReferenceToInstanceOne = getRmqConnection();

	expect(instance).toEqual(instanceTwoShouldBeReferenceToInstanceOne);
});

test('publishJsonToQueue - publishes the JSON.strigfied content to the default exchange and the provided queue, setting content-type to application/json', async () => {
	const queue = 'mailer';
	let content = { id: 1 };
	let options = {};

	const instance = getRmqConnection();
	await publishJsonToQueue(queue, content, options);

	expect(instance.publish).toHaveBeenLastCalledWith(
		DEFAULT_EXCHANGE,
		queue,
		JSON.stringify(content),
		{ ...options, contentType: 'application/json' }
	);

	options = { userId: '1' };
	content = { id: 123 };

	await publishJsonToQueue(queue, content, options);

	expect(instance.publish).toHaveBeenLastCalledWith(
		DEFAULT_EXCHANGE,
		queue,
		JSON.stringify(content),
		{ ...options, contentType: 'application/json' }
	);
});
