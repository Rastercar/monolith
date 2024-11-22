import { recoverPasswordSchema } from '$lib/api/auth.schema';
import { route } from '$lib/ROUTES';
import { findUserByEmail, setUserResetPasswordToken } from '$lib/server/db/repo/user';
import { sendRecoverPasswordEmail } from '$lib/services/mailer';
import { fail } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	form: await superValidate(zod(recoverPasswordSchema))
});

export const actions: Actions = {
	recoverPassword: async ({ request, url }) => {
		const form = await superValidate(request, zod(recoverPasswordSchema));
		if (!form.valid) return fail(400, { form });

		const user = await findUserByEmail(form.data.email);
		if (!user) return setError(form, 'email', 'user not found with this email');

		const token = randomUUID();
		await setUserResetPasswordToken(user.id, token);

		const resetPasswordLink = `${url.origin}${route('/auth/change-password')}?token=${token}`;

		await sendRecoverPasswordEmail(user.email, { username: user.username, resetPasswordLink });

		return message(form, { text: 'Recovery email sent', type: 'success' });
	}
};
