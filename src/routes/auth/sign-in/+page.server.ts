import { signInSchema } from '$lib/api/auth.schema';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	form: await superValidate(zod(signInSchema))
});

export const actions = {
	default: async ({ cookies, request }) => {
		const form = await superValidate(request, zod(signInSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		return message(form, 'Form posted successfully!');

		// const body = await api.post('users/login', {
		// 	user: {
		// 		email: data.get('email'),
		// 		password: data.get('password')
		// 	}
		// });

		// if (body.errors) {
		// 	return fail(401, body);
		// }

		// const value = btoa(JSON.stringify(body.user));
		// cookies.set('jwt', value, { path: '/' });

		// redirect(307, '/');
	}
};
