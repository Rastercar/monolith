import { updateUserSchema } from '$lib/api/user.schema';
import { error } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	form: await superValidate(zod(updateUserSchema))
});

export const actions: Actions = {
	signIn: async ({ cookies, request, getClientAddress, url, locals }) => {
		const form = await superValidate(request, zod(updateUserSchema));
		if (!form.valid) return fail(400, { form });

		if (locals.user) return error(400);

		// const user = await findUserByEmail(form.data.email);
		// if (!user) return setError(form, 'email', 'user not found');

		// const isValidPassword = compareSync(form.data.password, user.password);
		// if (!isValidPassword) return setError(form, 'password', 'invalid password');

		// const { maxAge, expiresAt } = createSessionExpirationDateFromNow();

		// const session = await createSession({
		// 	ip: getClientAddress(),
		// 	userId: user.id,
		// 	userAgent: request.headers.get('User-Agent') ?? 'not-found',
		// 	expiresAt
		// });

		// setSessionCookie(cookies, session.sessionToken, maxAge);

		// const redirectRouteFromQuery = url.searchParams.get('redirect');

		// const redirectRoute =
		// 	// this would cause a loop (sign-in -> sign-out -> sign-in)
		// 	redirectRouteFromQuery === '/auth/sign-out'
		// 		? route('/client')
		// 		: (redirectRouteFromQuery ?? route('/client'));

		// redirect(307, redirectRoute);
	}
};
