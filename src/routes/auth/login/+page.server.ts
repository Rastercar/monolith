import { signInSchema } from '$lib/api/auth.schema';
import { route } from '$lib/ROUTES';
import { compareSync } from '$lib/server/crypto';
import { createSession } from '$lib/server/db/repo/session';
import { findUserByEmail } from '$lib/server/db/repo/user';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { createSessionExpirationDateFromNow, setSessionCookie } from '$lib/utils/session';
import { redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	form: await superValidate(zod(signInSchema))
});

export const actions = {
	signIn: async ({ cookies, request, getClientAddress, url }) => {
		const form = await validateFormWithFailOnError(request, signInSchema);

		const user = await findUserByEmail(form.data.email);
		if (!user) return setError(form, 'email', 'usuário não encontrado');

		const isValidPassword = compareSync(form.data.password, user.password);
		if (!isValidPassword) return setError(form, 'password', 'senha inválida');

		const { maxAge, expiresAt } = createSessionExpirationDateFromNow();

		const session = await createSession({
			ip: getClientAddress(),
			userId: user.id,
			userAgent: request.headers.get('User-Agent') ?? 'not-found',
			expiresAt
		});

		setSessionCookie(cookies, session.sessionToken, maxAge);

		const redirectRouteFromQuery = url.searchParams.get('redirect');

		const redirectRoute =
			// this would cause a loop (login -> logout -> login)
			redirectRouteFromQuery === '/auth/logout'
				? route('/client')
				: (redirectRouteFromQuery ?? route('/client'));

		redirect(307, redirectRoute);
	}
};
