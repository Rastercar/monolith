import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { z, ZodSchema } from 'zod';

export async function validateRequestBody<T extends z.ZodTypeAny>(
	req: Request,
	schema: T
): Promise<z.infer<T>> {
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

export function validateRequestSearchParams<T extends z.ZodTypeAny>(
	params: URLSearchParams,
	schema: T
): z.infer<T> {
	const { success, data, error: valError } = schema.safeParse(Object.fromEntries(params));

	if (!success) {
		error(400, { message: 'invalid search params', issues: valError.issues });
	}

	return data;
}

export async function validateFormWithFailOnError<T extends ZodSchema>(req: Request, schema: T) {
	const form = await superValidate(req, zod(schema));
	if (!form.valid) fail(400, { form });

	return form;
}
