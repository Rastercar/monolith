import { signUpSchema } from '$lib/api/auth.schema';
import { route } from '$lib/ROUTES';
import { redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	form: await superValidate(zod(signUpSchema))
});

export const actions = {
	signUp: async ({ cookies, request, getClientAddress, url }) => {
		const form = await superValidate(request, zod(signUpSchema));
		if (!form.valid) return fail(400, { form });

		// TODO:

		// const user = await getUserByCredentials(form.data);
		// if (!user) return setError(form, 'email', 'user not found');

		// const isValidPassword = compareSync(form.data.password, user.password);
		// if (!isValidPassword) return setError(form, 'password', 'invalid password');

		// const now = new Date();

		// const expiresDate = createDateXDaysFromNow(SESSION_DAYS_DURATION);
		// const diffSeconds = getDatesDiffInSeconds(now, expiresDate);

		// const session = await createSession({
		// 	ip: getClientAddress(),
		// 	userId: user.id,
		// 	userAgent: request.headers.get('User-Agent') ?? 'not-found',
		// 	expiresAt: expiresDate.toISOString()
		// });

		// cookies.set(SESSION_ID_COOKIE_KEY, session.sessionToken.toString(), {
		// 	path: '/',
		// 	secure: env.PUBLIC_IS_DEV !== 'true',
		// 	httpOnly: true,
		// 	sameSite: 'strict',
		// 	maxAge: diffSeconds
		// });

		// const redirectRouteFromQuery = url.searchParams.get('redirect');

		redirect(307, route('/client'));
	}
};
