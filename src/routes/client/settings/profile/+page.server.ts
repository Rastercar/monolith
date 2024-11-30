import { updateUserSchema } from '$lib/api/user.schema';
import { updateUser } from '$lib/server/db/repo/user';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { error } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
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

		const form = await validateFormWithFailOnError(request, updateUserSchema);

		const { email, username, password } = await updateUser(locals.user.id, form.data);
		locals.user = { ...locals.user, ...{ email, username, password } };

		return message(form, { text: 'user updated', type: 'success' });
	},

	updateProfilePicture: async ({ request, locals }) => {
		if (!locals.user) return error(400);

		const form = await validateFormWithFailOnError(request, updateUserSchema);

		await updateUser(locals.user.id, form.data);

		return message(form, { text: 'user updated', type: 'success' });
	}
};
