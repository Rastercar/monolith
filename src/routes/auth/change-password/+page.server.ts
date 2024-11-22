import { recoverPasswordByTokenSchema } from '$lib/api/auth.schema';
import { hashSync } from '$lib/server/crypto';
import {
	findUserByResetPasswordToken,
	setPasswordAndClearResetPasswordToken
} from '$lib/server/db/repo/user';
import { error, type Actions } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const form = await superValidate(zod(recoverPasswordByTokenSchema));
	const passwordRecoveryToken = url.searchParams.get('token');

	if (!passwordRecoveryToken) {
		return error(500, { message: 'no password recovery token found' });
	}

	const user = await findUserByResetPasswordToken(passwordRecoveryToken);

	return { form, passwordRecoveryToken };
};

export const actions: Actions = {
	changePassword: async ({ request, url }) => {
		const form = await superValidate(request, zod(recoverPasswordByTokenSchema));
		if (!form.valid) return fail(400, { form });

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

		return message(form, { text: 'Password changed successfully', type: 'success' });
	}
};
