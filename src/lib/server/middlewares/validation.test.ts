import * as kitHelpers from '@sveltejs/kit';
import * as superforms from 'sveltekit-superforms';
import { describe, expect, test, vi } from 'vitest';
import { z } from 'zod';
import {
	validateFormWithFailOnError,
	validateRequestBody,
	validateRequestSearchParams
} from './validation';

vi.mock('@sveltejs/kit');
vi.mock('sveltekit-superforms');

const kitHelpersMock = vi.mocked(kitHelpers);
const superformsMock = vi.mocked(superforms);

const testSchema = z.object({ id: z.string() });
const validData = { id: '1' };

describe('validateRequestBody', () => {
	test('calls error (400) if the request body is invalid json', async () => {
		const req = new Request('http://test.com', { body: JSON.stringify({}) + '}', method: 'POST' });

		await validateRequestBody(req, testSchema);

		expect(kitHelpersMock.error).toHaveBeenLastCalledWith(
			400,
			expect.objectContaining({ message: 'invalid request body' })
		);
	});

	test('calls error (400) if the request body is valid json but invalid data', async () => {
		const req = new Request('http://test.com', { body: '123', method: 'POST' });

		await validateRequestBody(req, testSchema);

		expect(kitHelpersMock.error).toHaveBeenLastCalledWith(
			400,
			expect.objectContaining({ message: 'invalid request body' })
		);
	});

	test('returns the parsed data on success', async () => {
		const req = new Request('http://test.com', { body: JSON.stringify(validData), method: 'POST' });

		const res = await validateRequestBody(req, testSchema);
		expect(res).toStrictEqual(validData);
	});
});

describe('validateRequestSearchParams', () => {
	test('fails on invalid search params', () => {
		const params = new URLSearchParams();

		validateRequestSearchParams(params, testSchema);

		expect(kitHelpersMock.error).toHaveBeenLastCalledWith(
			400,
			expect.objectContaining({ message: 'invalid search params' })
		);
	});

	test('returns the parsed params on success', () => {
		const params = new URLSearchParams();
		params.set('id', '1');

		expect(validateRequestSearchParams(params, testSchema)).toStrictEqual(validData);
	});
});

describe('validateFormWithFailOnError', () => {
	test('calls sveltekit fail on invalid request body', async () => {
		const req = new Request('http://test.com', { body: '', method: 'POST' });

		const invalidFormResponse = { valid: false } as unknown as superforms.SuperValidated<
			Record<string, unknown>
		>;

		superformsMock.superValidate.mockResolvedValue(invalidFormResponse);
		await validateFormWithFailOnError(req, testSchema);

		expect(kitHelpersMock.fail).toHaveBeenLastCalledWith(400, { form: invalidFormResponse });
	});

	test('returns the parsed data on valid data', async () => {
		const req = new Request('http://test.com', { body: '', method: 'POST' });

		const validForm = { valid: true } as unknown as superforms.SuperValidated<
			Record<string, unknown>
		>;

		superformsMock.superValidate.mockResolvedValue(validForm);
		const res = await validateFormWithFailOnError(req, testSchema);

		expect(res).toEqual(validForm);
	});
});
