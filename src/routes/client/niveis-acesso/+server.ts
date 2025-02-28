import { getAccessLevelSearchParamsSchema } from '$lib/api/access-level.schema';
import { findOrgAccessLevelsWithPagination } from '$lib/server/db/repo/access-level';
import { acl } from '$lib/server/middlewares/auth';
import { validateRequestSearchParams } from '$lib/server/middlewares/validation';
import { getPaginationParamsFromSearchParams } from '$lib/utils/pagination';
import { json } from '@sveltejs/kit';

export const GET = async ({ url, locals }) => {
	const { orgId } = acl(locals);

	const pagination = getPaginationParamsFromSearchParams(url.searchParams);

	const filters = validateRequestSearchParams(url.searchParams, getAccessLevelSearchParamsSchema);

	const accessLevels = await findOrgAccessLevelsWithPagination(orgId, { pagination, filters });

	return json(accessLevels);
};
