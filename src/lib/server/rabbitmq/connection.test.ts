import { asyncNoOperation, noOperation } from '$lib/utils/functions';
import { delay } from '$lib/utils/promises';
import type { Channel, Connection } from 'amqplib';
import * as amqp from 'amqplib';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { MAX_RECONNECTION_ATTEMPTS, RabbitMQConnection } from './connection';
import { MAILER_QUEUE, TRACKER_EVENTS_EXCHANGE, TRACKER_EVENTS_QUEUE } from './constants';
import { trackerEventsConsumer } from './consumers';
import * as rmqHelpers from './rmq-helpers';

vi.mock('./rmq-helpers');
vi.mock('amqplib');

const rmqHelpersMock = vi.mocked(rmqHelpers);
const amqpMock = vi.mocked(amqp);

describe('RabbitMQConnection', () => {
	let con!: RabbitMQConnection;

	beforeEach(() => {
		con = new RabbitMQConnection('', false);
	});

	test('startConsumers - starts the trackerEventsConsumer', () => {
		con.consume = vi.fn();

		con.startConsumers();

		expect(con.consume).toHaveBeenLastCalledWith(
			trackerEventsConsumer.queue,
			trackerEventsConsumer.handler,
			trackerEventsConsumer.options
		);
	});

	test('consume - calls amqp.consume on a channel exclusively for consuming messages', () => {
		const queue = 'queue';
		const cb = noOperation;
		const opts = {};

		con.consumeChannel = null;

		const res = con.consume(queue, cb, opts);
		expect(res).toBe(false);

		con.consumeChannel = { consume: vi.fn() } as unknown as Channel;

		con.consume(queue, cb, opts);
		expect(con.consumeChannel.consume).toHaveBeenLastCalledWith(queue, cb, opts);
	});

	test('publish - calls amqp.publish on a channel exclusively for publishing messages', () => {
		const exchange = 'some-exchange';
		const content = 'some-content';
		const routingKey = 'key';
		const opts = {};

		con.publishChannel = null;

		const res = con.publish(exchange, routingKey, content, opts);
		expect(res).toBe(false);

		con.publishChannel = { publish: vi.fn() } as unknown as Channel;

		con.publish(exchange, routingKey, content, opts);
		expect(con.publishChannel.publish).toHaveBeenLastCalledWith(
			exchange,
			routingKey,
			Buffer.from(content),
			opts
		);
	});

	describe('handleConnectionError', () => {
		const err = new Error('!');

		beforeEach(() => {
			con.connect = vi.fn();
			con.reportFatalError = vi.fn();
		});

		test('does not attempt to reconnect if MAX_RECONNECTION_ATTEMPTS has been reached and calls reportFatalError', async () => {
			con.reconectionAttempt = MAX_RECONNECTION_ATTEMPTS + 1;

			await con.handleConnectionError(err);

			expect(con.connect).not.toHaveBeenCalled();
			expect(con.reportFatalError).toHaveBeenLastCalledWith(err);
		});

		test('does not attempt to reconnect if getRmqConnectionErrorInfo returns shouldRetry = false', async () => {
			rmqHelpersMock.getRmqConnectionErrorInfo.mockReturnValueOnce({
				shouldRetry: false,
				code: ''
			});

			await con.handleConnectionError(err);

			expect(con.connect).not.toHaveBeenCalled();
			expect(con.reportFatalError).toHaveBeenLastCalledWith(err);
		});

		test('clears and sets the new reconnectTimeout', async () => {
			rmqHelpersMock.getRmqConnectionErrorInfo.mockReturnValueOnce({
				shouldRetry: true,
				code: ''
			});

			const oldTimeoutRef = con.reconnectTimeout;

			await con.handleConnectionError(err);

			const newTimeoutRef = con.reconnectTimeout;

			expect(con.connect).not.toHaveBeenCalled();
			expect(oldTimeoutRef).not.toEqual(newTimeoutRef);
		});

		test('attempts to reconect if shouldRetry = true after the ellapsed milliseconds', async () => {
			rmqHelpersMock.getRmqConnectionErrorInfo.mockReturnValueOnce({
				shouldRetry: true,
				code: ''
			});

			const waitTimeMs = 10;
			const leeway = 20;

			con.getMillisecondsToWaitUntilNextReconnectAttempt = vi.fn(() => waitTimeMs);

			await con.handleConnectionError(err);
			await delay(waitTimeMs + leeway);

			expect(con.connect).toHaveBeenCalled();
			expect(con.reconectionAttempt).toBeGreaterThan(0);
		});
	});

	describe('declareQueues', () => {
		test('skip declaration if the publish channel is not available', async () => {
			const res = await con.declareQueues().then(() => 1);
			expect(res).toBe(1);
		});

		test('declares the required queues', async () => {
			con.publishChannel = { assertQueue: vi.fn() } as unknown as Channel;
			await con.declareQueues();

			expect(con.publishChannel.assertQueue).toHaveBeenCalledWith(TRACKER_EVENTS_QUEUE, {
				exclusive: false,
				durable: false,
				autoDelete: true
			});

			expect(con.publishChannel.assertQueue).toHaveBeenCalledWith(MAILER_QUEUE, {
				durable: true,
				exclusive: false,
				autoDelete: false,
				arguments: { 'x-message-ttl': 30_000 }
			});
		});
	});

	describe('declareExchanges', () => {
		test('skip declaration if the publish channel is not available', async () => {
			await expect(con.declareExchanges()).resolves.toBeUndefined();
		});

		test('declares the required exchanges', async () => {
			con.publishChannel = { assertExchange: vi.fn() } as unknown as Channel;
			await con.declareExchanges();

			expect(con.publishChannel.assertExchange).toHaveBeenCalledWith(
				TRACKER_EVENTS_EXCHANGE,
				'topic',
				{
					durable: true,
					internal: false,
					autoDelete: false
				}
			);
		});
	});

	describe('bindQueuesAndExchanges', () => {
		test('skip binding if the publish channel is not available', async () => {
			await expect(con.bindQueuesAndExchanges()).resolves.toBeUndefined();
		});

		test('declares the required exchanges', async () => {
			con.publishChannel = { bindQueue: vi.fn() } as unknown as Channel;
			await con.bindQueuesAndExchanges();

			expect(con.publishChannel.bindQueue).toHaveBeenCalledWith(
				TRACKER_EVENTS_QUEUE,
				TRACKER_EVENTS_EXCHANGE,
				'#'
			);
		});
	});

	test('onConnectionClosed - sets channels and connection to null and attempts to reconnect', async () => {
		con.connection = {} as Connection;
		con.publishChannel = {} as Channel;
		con.consumeChannel = {} as Channel;

		con.connect = vi.fn();
		await con.onConnectionClosed();

		expect(con.connection).toBeNull();
		expect(con.publishChannel).toBeNull();
		expect(con.consumeChannel).toBeNull();

		expect(con.connect).toHaveBeenCalledTimes(1);
	});

	describe('connect', () => {
		beforeEach(() => {
			con.declareQueues = vi.fn(asyncNoOperation);
			con.declareExchanges = vi.fn(asyncNoOperation);
			con.bindQueuesAndExchanges = vi.fn(asyncNoOperation);

			con.startConsumers = vi.fn(asyncNoOperation);
			con.handleConnectionError = vi.fn(asyncNoOperation);
		});

		test('calls amqp.connect with the given url and adds a heartbeat param', async () => {
			await con.connect();

			expect(amqpMock.connect).toHaveBeenLastCalledWith(`${con.connetionUrl}?heartbeat=${15}`);
		});

		test('calls handleConnectionError on error', async () => {
			const conError = new Error('!');

			amqpMock.connect.mockRejectedValueOnce(conError);
			await con.connect();

			expect(con.handleConnectionError).toHaveBeenLastCalledWith(conError);
		});

		test('registers on error and on closed callbacks on the new connection', async () => {
			const on = vi.fn();

			amqpMock.connect.mockResolvedValueOnce({ on } as unknown as Connection);

			await con.connect();

			expect(on).toHaveBeenCalledWith('error', expect.anything());
			expect(on).toHaveBeenCalledWith('close', expect.anything());
		});

		test('sets reconectionAttempt to 0 on a successfull connection', async () => {
			const on = vi.fn();
			const createChannel = vi.fn();

			amqpMock.connect.mockResolvedValueOnce({
				on,
				createChannel
			} as unknown as Connection);

			con.reconectionAttempt = 10;
			await con.connect();

			expect(con.reconectionAttempt).toBe(0);
		});

		test('calls declareQueues, declareExchanges, bindQueuesAndExchanges and startConsumers on success', async () => {
			const on = vi.fn();
			const createChannel = vi.fn();

			amqpMock.connect.mockResolvedValueOnce({
				on,
				createChannel
			} as unknown as Connection);

			await con.connect();

			expect(con.declareQueues).toHaveBeenCalledTimes(1);
			expect(con.declareExchanges).toHaveBeenCalledTimes(1);
			expect(con.bindQueuesAndExchanges).toHaveBeenCalledTimes(1);
			expect(con.startConsumers).toHaveBeenCalledTimes(1);
		});
	});
});
