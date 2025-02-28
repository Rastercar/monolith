import { requestEmailConfirmationSchema } from '$lib/api/auth.schema';
import { route } from '$lib/ROUTES';
import { setConfirmBillingEmailToken } from '$lib/server/db/repo/organization';
import { setConfirmEmailToken } from '$lib/server/db/repo/user';
import { acl } from '$lib/server/middlewares/auth';
import { validateJsonRequestBody } from '$lib/server/middlewares/validation';
import { sendConfirmEmailAddressEmail } from '$lib/server/services/mailer';
import { json } from '@sveltejs/kit';
import { randomUUID } from 'crypto';

export const POST = async ({ locals, request, url }) => {
	const { user } = acl(locals);

	const { email, id, emailVerified, username, organization } = user;

	const { confirmingForOrg = false } = await validateJsonRequestBody(
		request,
		requestEmailConfirmationSchema
	);

	const token = randomUUID();

	const confirmationLink = `${url.origin}${route('/auth/confirmar-email')}?token=${token}&confirmingForOrg=${confirmingForOrg}`;

	const subject = confirmingForOrg
		? 'Rastercar - Confirmação de email de sua organização'
		: 'Rastercar - Confirmação de endereço de email';

	if (confirmingForOrg) {
		if (organization.billingEmailVerified) return json('email já verificado');
		await setConfirmBillingEmailToken(organization.id, token);
	} else {
		if (emailVerified) return json('email já verificado');
		await setConfirmEmailToken(id, token);
	}

	await sendConfirmEmailAddressEmail({
		email,
		subject,
		replacements: { title: `Olá ${username}`, confirmationLink }
	});

	return json('email de confirmação enviado');
};
