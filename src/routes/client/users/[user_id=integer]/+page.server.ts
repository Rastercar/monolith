import { getIntParameterFromRouteSlug } from '$lib/utils/routes';

export const load = async ({ params }) => ({
	userId: getIntParameterFromRouteSlug(params.user_id, 'invalid user ID')
});
