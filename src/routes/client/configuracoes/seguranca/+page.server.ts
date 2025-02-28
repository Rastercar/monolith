import { changePasswordSchema } from '$lib/api/user.schema';
import { compareSync, hashSync } from '$lib/server/crypto';
import { findUserById, updateUserPassword } from '$lib/server/db/repo/user';
import { acl } from '$lib/server/middlewares/auth';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { error } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ url }) => {
	const form = await superValidate(zod(changePasswordSchema));

	const redirectHereDueToForcePasswordChange = !!url.searchParams.get(
		'redirectHereDueToForcePasswordChange'
	);

	return { form, redirectHereDueToForcePasswordChange };
};

export const actions = {
	changePassword: async ({ request, locals }) => {
		const { user } = acl(locals);

		const form = await validateFormWithFailOnError(request, changePasswordSchema);

		const userWithPassword = await findUserById(user.id);
		if (!userWithPassword) return error(500);

		const { password } = userWithPassword;

		const oldPasswordIsValid = compareSync(form.data.oldPassword, password);
		if (!oldPasswordIsValid) return setError(form, 'oldPassword', 'senha inválida');

		const newPasswordHash = hashSync(form.data.newPassword);
		await updateUserPassword(user.id, newPasswordHash);

		return message(form, { text: 'senha atualizada', type: 'success' });
	}
};
