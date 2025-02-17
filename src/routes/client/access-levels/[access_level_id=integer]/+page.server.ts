import { accessLevelSchema, updateAccessLevelSchema } from '$lib/api/access-level.schema';
import { findOrgAccessLevelById, updateOrgAccessLevel } from '$lib/server/db/repo/access-level';
import { acl } from '$lib/server/middlewares/auth';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals }) => {
	const { orgId } = acl(locals);

	const accessLevelId = parseInt(params.access_level_id);

	const accessLevelFromDb = await findOrgAccessLevelById({ id: accessLevelId, orgId });

	if (!accessLevelFromDb) return error(404);

	const accessLevel = accessLevelSchema.parse(accessLevelFromDb);

	const updateAccessLevelForm = await superValidate(zod(updateAccessLevelSchema), {
		defaults: accessLevel
	});

	return { accessLevel, updateAccessLevelForm };
};

export const actions = {
	updateAccessLevel: async ({ request, locals, params }) => {
		const { user, orgId } = acl(locals, { requiredPermissions: 'MANAGE_USER_ACCESS_LEVELS' });

		const alId = parseInt(params.access_level_id);

		if (user.accessLevel.id === alId) {
			return error(403, 'cannot update your own access level');
		}

		const form = await validateFormWithFailOnError(request, updateAccessLevelSchema);

		const accessLevel = await findOrgAccessLevelById({ id: alId, orgId });
		if (!accessLevel) return error(404, 'access level not found');

		if (accessLevel.isFixed) {
			return error(403, 'cannot update fixed access levels');
		}

		const al = await updateOrgAccessLevel({ id: alId, orgId }, form.data);

		const updatedAccessLevel = accessLevelSchema.parse(al);
		return { form, updatedAccessLevel };
	}
};
