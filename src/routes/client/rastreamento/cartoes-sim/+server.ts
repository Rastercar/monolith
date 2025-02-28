import { getSimCardsSearchParamsSchema } from '$lib/api/sim-card.schema';
import { findOrgSimCardsWithPagination } from '$lib/server/db/repo/sim-card';
import { acl } from '$lib/server/middlewares/auth';
import { validateRequestSearchParams } from '$lib/server/middlewares/validation';
import { getPaginationParamsFromSearchParams } from '$lib/utils/pagination';
import { json } from '@sveltejs/kit';

export const GET = async ({ url, locals }) => {
	const { orgId } = acl(locals);

	const pagination = getPaginationParamsFromSearchParams(url.searchParams);

	const filters = validateRequestSearchParams(url.searchParams, getSimCardsSearchParamsSchema);

	const simCards = await findOrgSimCardsWithPagination(orgId, { pagination, filters });

	return json(simCards);
};
