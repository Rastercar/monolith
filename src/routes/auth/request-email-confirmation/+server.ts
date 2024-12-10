import { requestEmailConfirmationSchema } from '$lib/api/auth.schema';
import { route } from '$lib/ROUTES';
import { setConfirmBillingEmailToken } from '$lib/server/db/repo/organization';
import { setConfirmEmailToken } from '$lib/server/db/repo/user';
import { acl } from '$lib/server/middlewares/auth';
import { validateRequestBody } from '$lib/server/middlewares/validation';
import { sendConfirmEmailAddressEmail } from '$lib/server/services/mailer';
import { json } from '@sveltejs/kit';
import { randomUUID } from 'crypto';

export const POST = async ({ locals, request, url }) => {
	const { user } = acl(locals);

	const { email, id, emailVerified, username, organization } = user;

	const { confirmingForOrg = false } = await validateRequestBody(
		request,
		requestEmailConfirmationSchema
	);

	const token = randomUUID();

	const confirmationLink = `${url.origin}${route('/auth/confirm-email-address')}?token=${token}&confirmingForOrg=${confirmingForOrg}`;

	if (confirmingForOrg) {
		if (organization.billingEmailVerified) return json('email already verified');

		await setConfirmBillingEmailToken(organization.id, token);

		await sendConfirmEmailAddressEmail(email, 'Rastercar - confirm organization email address', {
			title: `Hello ${username}`,
			confirmationLink
		});
	} else {
		if (emailVerified) return json('email already verified');

		await setConfirmEmailToken(id, token);

		await sendConfirmEmailAddressEmail(email, 'Rastercar - confirm your email address', {
			title: `Hello ${username}`,
			confirmationLink
		});
	}

	return json('confirmation email sent');
};
