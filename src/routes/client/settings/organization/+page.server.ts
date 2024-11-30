import { updateOrganizationSchema } from '$lib/api/organization.schema';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { error, type Actions } from '@sveltejs/kit';
import { updateOrganization } from '$lib/server/db/repo/organization';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return error(400);

	const form = await superValidate(zod(updateOrganizationSchema), {
		defaults: locals.user.organization
	});

	return { form };
};

export const actions: Actions = {
	updateOrganization: async ({ request, locals }) => {
		if (!locals.user) return error(400);

		const form = await validateFormWithFailOnError(request, updateOrganizationSchema);
		await updateOrganization(form.data);

		return message(form, { text: 'organization updated', type: 'success' });
	}
};
