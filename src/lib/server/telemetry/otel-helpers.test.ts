import { describe, expect, test } from 'vitest';
import { amqpHeadersTextMapGetter } from './otel-helpers';

describe('amqpHeadersTextMapGetter', () => {
	test('get returns the value at the carrier[key]', () => {
		expect(amqpHeadersTextMapGetter.get({}, 'a')).toBeUndefined();
		expect(amqpHeadersTextMapGetter.get({ a: 'val' }, 'a')).toBe('val');
	});

	test('key simply calls Object.keys(carrier), returning all the carrier keys', () => {
		expect(amqpHeadersTextMapGetter.keys({ a: 'val' })).toStrictEqual(['a']);
	});
});
