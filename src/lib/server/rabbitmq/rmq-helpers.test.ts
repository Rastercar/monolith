import type { ConsumeMessage } from 'amqplib';
import { describe, expect, test, vi } from 'vitest';
import * as otelUtils from '../telemetry/otel-helpers';
import { amqpHeadersTextMapGetter } from '../telemetry/otel-helpers';
import { getOtelContextFromDeliveryHeaders, getRmqConnectionErrorInfo } from './rmq-helpers';

vi.mock('../telemetry/otel-helpers', async (importOriginal) => ({
	...(await importOriginal()),
	jaegerPropagator: {
		extract: vi.fn()
	}
}));

const contextMock = {
	getValue: vi.fn(),
	setValue: vi.fn(),
	deleteValue: vi.fn()
};

vi.mock('@opentelemetry/api');

const otelUtilsMock = vi.mocked(otelUtils);

test('getOtelContextFromDeliveryHeaders - defines the context by using the jaeger propagator and the delivery headers', () => {
	const amqpDeliveryMock = {
		fields: {},
		content: Buffer.from(''),
		properties: { headers: { 'x-death': '1' } }
	} as unknown as ConsumeMessage;

	vi.mocked(otelUtilsMock.jaegerPropagator.extract).mockImplementation(() => contextMock);

	const ctx = getOtelContextFromDeliveryHeaders(amqpDeliveryMock);

	expect(otelUtilsMock.jaegerPropagator.extract).toHaveBeenLastCalledWith(
		undefined,
		amqpDeliveryMock.properties.headers,
		amqpHeadersTextMapGetter
	);
	expect(ctx).toBe(contextMock);
});

describe('getRmqConnectionErrorInfo', () => {
	test("returns shouldRetry: false, code: 'unknown' if the value is not a instance of an error or a object", () => {
		const expected = { shouldRetry: false, code: 'unknown' };

		const inputs: unknown[] = [
			1,
			'',
			null,
			Number.NaN,
			{},
			[],
			undefined,
			new Date(),
			new RegExp('')
		];

		for (let i = 0; i < inputs.length; i++) {
			expect(getRmqConnectionErrorInfo(inputs[i])).toStrictEqual(expected);
		}
	});

	test("returns shouldRetry: true, code: 'unknown' if error.toString() contains Socket closed", () => {
		const expected = { shouldRetry: true, code: 'unknown' };

		expect(getRmqConnectionErrorInfo(new Error('Socket closed'))).toStrictEqual(expected);
	});

	test('returns shouldRetry: true, and the correct code if the error code is retry worthy', () => {
		const retryWorthyCodes = [
			'ECONNREFUSED',
			'ECONNRESET',
			'ETIMEDOUT',
			'EHOSTUNREACH',
			'ENETUNREACH'
		];

		for (let i = 0; i < retryWorthyCodes.length; i++) {
			const expected = { shouldRetry: true, code: retryWorthyCodes[i] };
			const res = getRmqConnectionErrorInfo({ code: retryWorthyCodes[i] });

			expect(res).toStrictEqual(expected);
		}
	});
});
