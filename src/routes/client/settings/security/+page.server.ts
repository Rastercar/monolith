import { changePasswordSchema } from '$lib/api/user.schema';
import { compareSync, hashSync } from '$lib/server/crypto.js';
import { findUserById, updateUserPassword } from '$lib/server/db/repo/user';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { error } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	form: await superValidate(zod(changePasswordSchema))
});

export const actions = {
	changePassword: async ({ request, locals }) => {
		if (!locals.user) return error(400);

		const form = await validateFormWithFailOnError(request, changePasswordSchema);

		const userWithPassword = await findUserById(locals.user.id);
		if (!userWithPassword) return error(500);

		const { password } = userWithPassword;

		const oldPasswordIsValid = compareSync(form.data.oldPassword, password);
		if (!oldPasswordIsValid) return setError(form, 'oldPassword', 'invalid password');

		const newPasswordHash = hashSync(form.data.newPassword);
		await updateUserPassword(locals.user.id, newPasswordHash);

		return message(form, { text: 'password updated', type: 'success' });
	}
};
