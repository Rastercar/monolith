import { describe, expect, test } from 'vitest';
import { z } from 'zod';
import { readBufferAsUtf8JsonOfSchema } from './buffer';

describe('readBufferAsUtf8JsonOfSchema', () => {
	test('throws if the buffer is not valid utf8', () => {
		const invalidBuffer = Buffer.from('Hello, World!', 'ascii');

		expect(() => readBufferAsUtf8JsonOfSchema(invalidBuffer, z.object({}))).toThrow();
	});

	test('throws if the buffer is not valid json', () => {
		const invalidBuffer = Buffer.from('{{}/}', 'utf-8');
		expect(() => readBufferAsUtf8JsonOfSchema(invalidBuffer, z.object({}))).toThrow();
	});

	test('throws if the buffer is valid json but not of the schema', () => {
		const invalidBuffer = Buffer.from(JSON.stringify(1), 'utf-8');
		expect(() => readBufferAsUtf8JsonOfSchema(invalidBuffer, z.object({}))).toThrow();
	});

	test('returns the parsed json contained on the buffer if matches the schema', () => {
		const invalidBuffer = Buffer.from(JSON.stringify({}), 'utf-8');
		expect(readBufferAsUtf8JsonOfSchema(invalidBuffer, z.object({}))).toStrictEqual({});
	});
});
