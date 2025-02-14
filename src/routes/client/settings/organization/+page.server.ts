import { updateOrganizationSchema } from '$lib/api/organization.schema';
import { updateOrganization } from '$lib/server/db/repo/organization';
import { acl } from '$lib/server/middlewares/auth';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals }) => {
	const { user } = acl(locals);

	const form = await superValidate(zod(updateOrganizationSchema), { defaults: user.organization });

	return { form };
};

export const actions = {
	updateOrganization: async ({ request, locals }) => {
		const { user } = acl(locals, { requiredPermissions: 'UPDATE_ORGANIZATION' });

		const form = await validateFormWithFailOnError(request, updateOrganizationSchema);
		await updateOrganization(user.organization.id, form.data);

		return message(form, { text: 'organization updated', type: 'success' });
	}
};
