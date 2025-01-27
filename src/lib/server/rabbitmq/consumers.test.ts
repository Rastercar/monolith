import type { Span } from '@opentelemetry/api';
import * as otel from '@opentelemetry/api';
import type { Tracer } from '@opentelemetry/sdk-trace-base';
import amqp from 'amqplib';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as h02PositionHandler from '../tracking/h02/position';
import { TRACKER_EVENTS_QUEUE } from './constants';
import { trackerEventsConsumer } from './consumers';
import * as trackerIdCache from './tracker-id-cache';

vi.mock('@opentelemetry/api', async (importActual) => ({
	...(await importActual()),
	trace: {
		getTracer: vi.fn()
	}
}));

vi.mock('./tracker-id-cache');
vi.mock('../tracking/h02/position');

const otelMock = vi.mocked(otel);
const trackerCacheMock = vi.mocked(trackerIdCache);
const h02PositionHandlerMock = vi.mocked(h02PositionHandler);

describe('trackerEventsConsumer', () => {
	test('consume events from the TRACKER_EVENTS_QUEUE', () => {
		expect(trackerEventsConsumer.queue).toBe(TRACKER_EVENTS_QUEUE);
	});

	test('has noAck on options due to perfomance reasons', () => {
		expect(trackerEventsConsumer.options.noAck).toBe(true);
		expect(trackerEventsConsumer.options.consumerTag).toBeTypeOf('string');
	});

	describe('handler', () => {
		const protocol = 'protocol';
		const eventType = 'eventType';
		const imei = 'imei';

		const emptyInvalidMessage = {
			fields: {
				routingKey: '',
				consumerTag: '',
				deliveryTag: 0,
				redelivered: false,
				exchange: ''
			},
			properties: {
				headers: {}
			}
		} as unknown as amqp.ConsumeMessage;

		const createMsg = (d?: Partial<amqp.ConsumeMessage>) => ({
			...emptyInvalidMessage,
			...d
		});

		let spanMock: Span;
		let tracerMock: Tracer;

		beforeEach(() => {
			spanMock = {
				end: vi.fn(),
				setAttribute: vi.fn(),
				recordException: vi.fn(),
				setStatus: vi.fn(),
				setAttributes: vi.fn()
			} as unknown as Span;

			tracerMock = {
				startSpan: vi.fn().mockReturnValue(spanMock)
			} as unknown as Tracer;

			vi.mocked(otelMock.trace.getTracer).mockReturnValue(tracerMock);
		});

		test('simply returns when delivery is null (this happens on connection or consumer being closed)', async () => {
			await expect(trackerEventsConsumer.handler(null)).resolves.toBeUndefined();
		});

		test('starts a span to record event handling data', async () => {
			await trackerEventsConsumer.handler(createMsg());

			expect(tracerMock.startSpan).toHaveBeenLastCalledWith(
				'process-tracker-event',
				{ kind: otel.SpanKind.CONSUMER },
				expect.anything()
			);
		});

		test("records the error: 'invalid event routing key' if the routing key does not contain 3 parts", async () => {
			const msg = createMsg();

			await trackerEventsConsumer.handler(msg);

			expect(spanMock.setStatus).toHaveBeenLastCalledWith({
				code: otel.SpanStatusCode.ERROR,
				message: 'invalid event routing key'
			});
		});

		test('sets protocol, eventType, imei as span attributes', async () => {
			const msg = createMsg();

			msg.fields.routingKey = `${protocol}.${eventType}.${imei}`;

			await trackerEventsConsumer.handler(msg);

			expect(spanMock.setAttributes).toHaveBeenLastCalledWith({ protocol, eventType, imei });
		});

		test('records error "cannot handle protocol and event" on unknown protocol/event combination', async () => {
			const msg = createMsg();

			msg.fields.routingKey = `${protocol}.${eventType}.${imei}`;

			await trackerEventsConsumer.handler(msg);

			expect(spanMock.setStatus).toHaveBeenLastCalledWith({
				code: otel.SpanStatusCode.ERROR,
				message: 'cannot handle protocol and event'
			});
		});

		test('sets the tracker id attribute according to what the cache returned', async () => {
			const msg = createMsg();
			msg.fields.routingKey = `h02.location.${imei}`;

			vi.mocked(trackerCacheMock.VEHICLE_TRACKER_IMEI_TO_ID_CACHE.get).mockResolvedValueOnce(1);

			await trackerEventsConsumer.handler(msg);
			expect(spanMock.setAttribute).toHaveBeenLastCalledWith('trackerId', '1');

			vi.mocked(trackerCacheMock.VEHICLE_TRACKER_IMEI_TO_ID_CACHE.get).mockResolvedValueOnce(null);

			await trackerEventsConsumer.handler(msg);
			expect(spanMock.setAttribute).toHaveBeenLastCalledWith('trackerId', 'null');
		});

		test("records the error 'tracker not found by imei' when the tracker is not found on the cache", async () => {
			const msg = createMsg();
			msg.fields.routingKey = `h02.location.${imei}`;

			vi.mocked(trackerCacheMock.VEHICLE_TRACKER_IMEI_TO_ID_CACHE.get).mockResolvedValueOnce(null);

			await trackerEventsConsumer.handler(msg);
			expect(spanMock.setAttribute).toHaveBeenLastCalledWith('trackerId', 'null');

			expect(spanMock.setStatus).toHaveBeenLastCalledWith({
				code: otel.SpanStatusCode.ERROR,
				message: 'tracker not found by imei'
			});
		});

		test('calls handleH02TrackerPosition on a valid h02 location event with a valid imei', async () => {
			const msg = createMsg();
			msg.fields.routingKey = `h02.location.${imei}`;

			const trackerId = 1;

			vi.mocked(trackerCacheMock.VEHICLE_TRACKER_IMEI_TO_ID_CACHE.get).mockResolvedValueOnce(
				trackerId
			);

			await trackerEventsConsumer.handler(msg);

			expect(h02PositionHandlerMock.handleH02TrackerPosition).toHaveBeenLastCalledWith(
				trackerId,
				msg.content
			);
		});

		test('records an error if handleH02TrackerPosition thors', async () => {
			const msg = createMsg();
			msg.fields.routingKey = `h02.location.${imei}`;

			vi.mocked(trackerCacheMock.VEHICLE_TRACKER_IMEI_TO_ID_CACHE.get).mockResolvedValueOnce(1);

			const error = new Error('wow !');

			vi.mocked(h02PositionHandlerMock.handleH02TrackerPosition).mockRejectedValueOnce(error);

			await trackerEventsConsumer.handler(msg);

			expect(spanMock.recordException).toHaveBeenLastCalledWith(error);
			expect(spanMock.setStatus).toHaveBeenLastCalledWith({ code: otel.SpanStatusCode.ERROR });
		});

		test('calls span.end once', async () => {
			const msg = createMsg();

			await trackerEventsConsumer.handler(msg);

			expect(spanMock.end).toHaveBeenCalledTimes(1);
		});
	});
});
