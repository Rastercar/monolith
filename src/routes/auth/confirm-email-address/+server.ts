import { confirmEmailAddressSchema } from '$lib/api/auth.schema';
import {
	findOrganizationByConfirmBillingEmailToken,
	setBillingEmailVerifiedAndClearConfirmEmailToken
} from '$lib/server/db/repo/organization';
import {
	findUserByConfirmEmailToken,
	setEmailVerifiedAndClearConfirmEmailToken
} from '$lib/server/db/repo/user';
import { validateJsonRequestBody } from '$lib/server/middlewares/validation';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { token, confirmingForOrg } = await validateJsonRequestBody(
		request,
		confirmEmailAddressSchema
	);

	const sendInvalidTokenError = () => error(404, 'invalid or expired token');

	if (confirmingForOrg) {
		const org = await findOrganizationByConfirmBillingEmailToken(token);
		if (!org) sendInvalidTokenError();

		await setBillingEmailVerifiedAndClearConfirmEmailToken(token);
	} else {
		const user = await findUserByConfirmEmailToken(token);
		if (!user) sendInvalidTokenError();

		await setEmailVerifiedAndClearConfirmEmailToken(token);
	}

	return json('email address confirmed');
};
