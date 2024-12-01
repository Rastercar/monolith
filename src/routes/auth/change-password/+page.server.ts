import { recoverPasswordByTokenSchema } from '$lib/api/auth.schema';
import { hashSync } from '$lib/server/crypto';
import {
	findUserByResetPasswordToken,
	setPasswordAndClearResetPasswordToken
} from '$lib/server/db/repo/user';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { error } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ url }) => {
	const form = await superValidate(zod(recoverPasswordByTokenSchema));
	const passwordRecoveryToken = url.searchParams.get('token');

	if (!passwordRecoveryToken) {
		return error(500, { message: 'no password recovery token found' });
	}

	const user = await findUserByResetPasswordToken(passwordRecoveryToken);

	return { form, passwordRecoveryToken };
};

export const actions = {
	changePassword: async ({ request }) => {
		const form = await validateFormWithFailOnError(request, recoverPasswordByTokenSchema);

		const user = await findUserByResetPasswordToken(form.data.token);
		if (!user) {
			return message(form, {
				text: 'invalid recovery token',
				type: 'error',
				code: 'ERR_TOKEN_NOT_FOUND'
			});
		}

		const hashedPassword = hashSync(form.data.newPassword);

		await setPasswordAndClearResetPasswordToken(hashedPassword, form.data.token);

		return message(form, { text: 'password changed', type: 'success' });
	}
};
