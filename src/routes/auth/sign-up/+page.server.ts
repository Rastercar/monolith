import { signUpSchema } from '$lib/api/auth.schema';
import { route } from '$lib/ROUTES';
import { createSession } from '$lib/server/db/repo/session';
import { checkEmailIsInUse, findUserByUsername, signUpUser } from '$lib/server/db/repo/user';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { sendWellcomeEmail } from '$lib/server/services/mailer.js';
import { createSessionExpirationDateFromNow, setSessionCookie } from '$lib/utils/session';
import { redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	form: await superValidate(zod(signUpSchema))
});

export const actions = {
	signUp: async ({ cookies, request, getClientAddress, url }) => {
		const form = await validateFormWithFailOnError(request, signUpSchema);

		const emailIsInUse = await checkEmailIsInUse(form.data.email);
		if (emailIsInUse) return setError(form, 'email', 'email address not available');

		const userWithUsername = await findUserByUsername(form.data.username);
		if (userWithUsername) return setError(form, 'username', 'username not available');

		const { user } = await signUpUser(form.data);

		const { maxAge, expiresAt } = createSessionExpirationDateFromNow();

		const session = await createSession({
			ip: getClientAddress(),
			userId: user.id,
			userAgent: request.headers.get('User-Agent') ?? 'not-found',
			expiresAt
		});

		setSessionCookie(cookies, session.sessionToken, maxAge);

		sendWellcomeEmail({ email: user.email, replacements: { username: user.username } });

		redirect(307, route('/client'));
	}
};
