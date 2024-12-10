import { updateUserSchema } from '$lib/api/user.schema';
import { updateUser } from '$lib/server/db/repo/user';
import { acl } from '$lib/server/middlewares/auth.js';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals }) => {
	const { user } = acl(locals);

	const form = await superValidate(zod(updateUserSchema), { defaults: user });
	return { form };
};

export const actions = {
	updateProfile: async ({ request, locals }) => {
		let { user } = acl(locals);

		const form = await validateFormWithFailOnError(request, updateUserSchema);

		const { email, username, password } = await updateUser(user.id, form.data);
		user = { ...user, ...{ email, username, password } };

		return message(form, { text: 'user updated', type: 'success' });
	},

	updateProfilePicture: async ({ request, locals }) => {
		const { user } = acl(locals);

		const form = await validateFormWithFailOnError(request, updateUserSchema);

		await updateUser(user.id, form.data);

		return message(form, { text: 'user updated', type: 'success' });
	}
};
