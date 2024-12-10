import { createUserSchema, simpleUserSchema } from '$lib/api/user.schema';
import { checkEmailIsInUse, createOrgUser, findUserByUsername } from '$lib/server/db/repo/user';
import { acl } from '$lib/server/middlewares/auth';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	createUserForm: await superValidate(zod(createUserSchema))
});

export const actions = {
	createUser: async ({ request, locals }) => {
		const { user } = acl(locals, { requiredPermissions: 'CREATE_USER' });

		const form = await validateFormWithFailOnError(request, createUserSchema);

		const emailIsInUse = await checkEmailIsInUse(form.data.email);
		if (emailIsInUse) return setError(form, 'email', 'email address not available');

		const userWithUsername = await findUserByUsername(form.data.username);
		if (userWithUsername) return setError(form, 'username', 'username not available');

		const newUser = await createOrgUser(user.organization.id, form.data);

		const createdUser = simpleUserSchema.parse(newUser);
		return { form, createdUser };
	}
};
