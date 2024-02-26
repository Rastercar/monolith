import { updateAccessLevelSchema } from '$lib/api/access-level.schema';
import { getIntParameterFromRouteSlug } from '$lib/utils/server-load';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => ({
	accessLevelId: getIntParameterFromRouteSlug(params.access_level_id, 'invalid access level ID'),
	updateAccessLevelForm: await superValidate(zod(updateAccessLevelSchema))
});
