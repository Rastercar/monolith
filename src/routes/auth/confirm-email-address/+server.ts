import {
	findUserByConfirmEmailToken,
	setEmailVerifiedAndClearConfirmEmailToken
} from '$lib/server/db/repo/user';
import { validateRequestBody } from '$lib/server/middlewares/validation';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

// TODO: use me !
export const POST: RequestHandler = async ({ request }) => {
	const token = await validateRequestBody(request, z.string().uuid());

	// TODO: we should display this on svelte pages
	const user = await findUserByConfirmEmailToken(token);
	if (!user) error(404, 'invalid or expired token');

	// TODO: check if user with token exists and return error on failure
	await setEmailVerifiedAndClearConfirmEmailToken(token);

	return json('email address confirmed successfully');
};
