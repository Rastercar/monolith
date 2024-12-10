import { accessLevelSchema, createAccessLevelSchema } from '$lib/api/access-level.schema';
import { createOrgAccessLevel } from '$lib/server/db/repo/access-level.js';
import { verifyUserHasPermissions } from '$lib/server/middlewares/auth';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	createAccessLevelForm: await superValidate(zod(createAccessLevelSchema))
});

export const actions = {
	createAccessLevel: async ({ request, locals: { user } }) => {
		if (!user) return error(400);
		verifyUserHasPermissions(user, 'CREATE_VEHICLE');

		const form = await validateFormWithFailOnError(request, createAccessLevelSchema);

		const al = await createOrgAccessLevel(user.organization.id, form.data);

		const createdAccessLevel = accessLevelSchema.parse(al);

		return { form, createdAccessLevel };
	}
};
