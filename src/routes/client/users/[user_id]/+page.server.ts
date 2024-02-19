import { getIntParameterFromRouteSlug } from '$lib/utils/server-load';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => ({
	userId: getIntParameterFromRouteSlug(params.user_id, 'invalid user ID')
});
