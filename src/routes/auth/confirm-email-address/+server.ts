import { confirmUserEmailAddressByToken } from '$lib/server/db/repo/user';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

export const POST: RequestHandler = async ({ request }) => {
	const { token } = await request.json();

	const { success } = z.string().uuid().safeParse(token);

	if (!success) return new Response('invalid token', { status: 400 });

	await confirmUserEmailAddressByToken(token);

	return new Response('email address confirmed successfully');
};
