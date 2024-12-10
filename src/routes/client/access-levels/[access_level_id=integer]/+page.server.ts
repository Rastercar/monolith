import { accessLevelSchema, updateAccessLevelSchema } from '$lib/api/access-level.schema';
import { findOrgAccessLevelById } from '$lib/server/db/repo/access-level';
import { getBooleanFromUrlQuery } from '$lib/utils/url';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals: { user }, url }) => {
	if (!user) return error(403);

	const accessLevelId = parseInt(params.access_level_id);

	const accessLevelFromDb = await findOrgAccessLevelById(accessLevelId, user.organization.id);

	if (!accessLevelFromDb) return error(404);

	const accessLevel = accessLevelSchema.parse(accessLevelFromDb);

	const startInEditMode = getBooleanFromUrlQuery(url, 'edit');

	const updateAccessLevelForm = await superValidate(zod(updateAccessLevelSchema));

	return { accessLevel, startInEditMode, updateAccessLevelForm };
};
