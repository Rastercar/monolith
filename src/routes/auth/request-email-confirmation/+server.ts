import { route } from '$lib/ROUTES';
import { setConfirmEmailToken } from '$lib/server/db/repo/user';
import { sendConfirmEmailAddressEmail } from '$lib/services/mailer';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { randomUUID } from 'crypto';

export const POST: RequestHandler = async ({ url, locals }) => {
	if (!locals.user) error(400);

	const { email, id, emailVerified, username } = locals.user;

	if (emailVerified) return json('email already verified');

	const token = randomUUID();

	await setConfirmEmailToken(id, token);

	const confirmationLink = `${url.origin}${route('/auth/confirm-email-address')}?token=${token}`;

	await sendConfirmEmailAddressEmail(email, { title: `Hello ${username}`, confirmationLink });

	return json('confirmation email sent');
};
