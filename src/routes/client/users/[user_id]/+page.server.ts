import { getIntParameterFromRouteSlug } from '$lib/utils/routes';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => ({
	userId: getIntParameterFromRouteSlug(params.user_id, 'invalid user ID')
});
