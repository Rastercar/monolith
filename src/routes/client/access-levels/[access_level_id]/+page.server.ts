import { getIntParameterFromRouteSlug } from '$lib/utils/server-load';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => ({
	accessLevelId: getIntParameterFromRouteSlug(params.access_level_id, 'invalid access level ID')
});
