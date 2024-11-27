import { updateUserSchema } from '$lib/api/user.schema';
import { updateUser } from '$lib/server/db/repo/user';
import { error } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return error(400);

	const form = await superValidate(zod(updateUserSchema), { defaults: locals.user });
	return { form };
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		if (!locals.user) return error(400);

		const form = await superValidate(request, zod(updateUserSchema));
		if (!form.valid) return fail(400, { form });

		const { email, username, password } = await updateUser(locals.user.id, form.data);
		locals.user = { ...locals.user, ...{ email, username, password } };

		return message(form, { text: 'user updated', type: 'success' });
	},

	updateProfilePicture: async ({ request, locals }) => {
		if (!locals.user) return error(400);

		const form = await superValidate(request, zod(updateUserSchema));
		if (!form.valid) return fail(400, { form });

		const { email, username, password } = await updateUser(locals.user.id, form.data);
		locals.user = { ...locals.user, ...{ email, username, password } };

		return message(form, { text: 'user updated', type: 'success' });
	}
};
