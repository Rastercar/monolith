import { recoverPasswordSchema } from '$lib/api/auth.schema';
import { route } from '$lib/ROUTES';
import { findUserByEmail, setUserResetPasswordToken } from '$lib/server/db/repo/user';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { sendRecoverPasswordEmail } from '$lib/server/services/mailer';
import { randomUUID } from 'crypto';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	form: await superValidate(zod(recoverPasswordSchema))
});

export const actions = {
	recoverPassword: async ({ request, url }) => {
		const form = await validateFormWithFailOnError(request, recoverPasswordSchema);

		const user = await findUserByEmail(form.data.email);
		if (!user) return setError(form, 'email', 'usuário não encontrado com este email');

		const token = randomUUID();
		await setUserResetPasswordToken(user.id, token);

		const resetPasswordLink = `${url.origin}${route('/auth/change-password')}?token=${token}`;

		await sendRecoverPasswordEmail({
			email: user.email,
			replacements: { username: user.username, resetPasswordLink }
		});

		return message(form, { text: 'Email de recuperação enviado', type: 'success' });
	}
};
