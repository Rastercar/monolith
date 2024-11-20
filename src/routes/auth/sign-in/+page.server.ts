import { env } from '$env/dynamic/public';
import { signInSchema } from '$lib/api/auth.schema';
import { SESSION_DAYS_DURATION, SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import { route } from '$lib/ROUTES';
import { compareSync } from '$lib/server/crypto';
import { createSession } from '$lib/server/db/repo/session';
import { getUserByCredentials } from '$lib/server/db/repo/user';
import { createDateXDaysFromNow, getDatesDiffInSeconds } from '$lib/utils/date';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	form: await superValidate(zod(signInSchema))
});

export const actions = {
	signIn: async ({ cookies, request, getClientAddress, url }) => {
		const form = await superValidate(request, zod(signInSchema));
		if (!form.valid) return fail(400, { form });

		const user = await getUserByCredentials(form.data);
		if (!user) return setError(form, 'email', 'user not found');

		const isValidPassword = compareSync(form.data.password, user.password);
		if (!isValidPassword) return setError(form, 'password', 'invalid password');

		const now = new Date();

		const expiresDate = createDateXDaysFromNow(SESSION_DAYS_DURATION);
		const diffSeconds = getDatesDiffInSeconds(now, expiresDate);

		const session = await createSession({
			ip: getClientAddress(),
			userId: user.id,
			userAgent: request.headers.get('User-Agent') ?? 'not-found',
			expiresAt: expiresDate.toISOString()
		});

		cookies.set(SESSION_ID_COOKIE_KEY, session.sessionToken.toString(), {
			path: '/',
			secure: env.PUBLIC_IS_DEV !== 'true',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: diffSeconds
		});

		const redirectRouteFromQuery = url.searchParams.get('redirect');

		const redirectRouteIsValid =
			!redirectRouteFromQuery || redirectRouteFromQuery === '/auth/sign-out';

		redirect(
			307,
			redirectRouteIsValid ? (redirectRouteFromQuery ?? route('/client')) : route('/client')
		);
	}
};
