import { updateOrganizationSchema } from '$lib/api/organization.schema';
import { updateOrganization } from '$lib/server/db/repo/organization';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { error } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals }) => {
	if (!locals.user) return error(400);

	const form = await superValidate(zod(updateOrganizationSchema), {
		defaults: locals.user.organization
	});

	return { form };
};

export const actions = {
	updateOrganization: async ({ request, locals }) => {
		if (!locals.user) return error(400);

		const form = await validateFormWithFailOnError(request, updateOrganizationSchema);
		await updateOrganization(form.data);

		return message(form, { text: 'organization updated', type: 'success' });
	}
};
