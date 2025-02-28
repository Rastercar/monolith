import { getFleetsSearchParamsSchema } from '$lib/api/fleet.schema.js';
import { findOrgFleetsWithPagination } from '$lib/server/db/repo/fleet.js';
import { acl } from '$lib/server/middlewares/auth';
import { validateRequestSearchParams } from '$lib/server/middlewares/validation';
import { getPaginationParamsFromSearchParams } from '$lib/utils/pagination';
import { json } from '@sveltejs/kit';

export const GET = async ({ url, locals }) => {
	const { orgId } = acl(locals);

	const pagination = getPaginationParamsFromSearchParams(url.searchParams);

	const filters = validateRequestSearchParams(url.searchParams, getFleetsSearchParamsSchema);

	const fleets = await findOrgFleetsWithPagination(orgId, { filters, pagination });

	return json(fleets);
};
