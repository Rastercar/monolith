import { accessLevelSchema, createAccessLevelSchema } from '$lib/api/access-level.schema';
import { createOrgAccessLevel } from '$lib/server/db/repo/access-level';
import { acl } from '$lib/server/middlewares/auth';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	createAccessLevelForm: await superValidate(zod(createAccessLevelSchema))
});

export const actions = {
	createAccessLevel: async ({ request, locals }) => {
		const { orgId } = acl(locals, { requiredPermissions: 'CREATE_VEHICLE' });

		const form = await validateFormWithFailOnError(request, createAccessLevelSchema);

		const al = await createOrgAccessLevel(orgId, form.data);

		const createdAccessLevel = accessLevelSchema.parse(al);

		return { form, createdAccessLevel };
	}
};
