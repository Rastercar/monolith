import { error } from '@sveltejs/kit';
import type { ZodSchema } from 'zod';

export async function validateRequestBody<T>(request: Request, schema: ZodSchema<T>) {
	let body: unknown;

	try {
		body = await request.json();
	} catch (e) {
		error(400, { message: 'invalid JSON body' });
	}

	const { success, data, error: valError } = schema.safeParse(body);

	if (!success) {
		error(400, { message: 'invalid request body', issues: valError.issues });
	}

	return data;
}
