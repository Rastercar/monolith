import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { ZodSchema } from 'zod';

export async function validateRequestBody<T>(req: Request, schema: ZodSchema<T>) {
	let body: unknown;

	try {
		body = await req.json();
	} catch (e) {
		error(400, { message: 'invalid JSON body' });
	}

	const { success, data, error: valError } = schema.safeParse(body);

	if (!success) {
		error(400, { message: 'invalid request body', issues: valError.issues });
	}

	return data;
}

export async function validateFormWithFailOnError<T extends ZodSchema>(req: Request, schema: T) {
	const form = await superValidate(req, zod(schema));
	if (!form.valid) fail(400, { form });

	return form;
}
