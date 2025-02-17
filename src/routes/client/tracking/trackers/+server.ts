import { getTrackersSearchParamsSchema } from '$lib/api/tracker.schema';
import { findOrgTrackersWithPagination } from '$lib/server/db/repo/vehicle-tracker';
import { acl } from '$lib/server/middlewares/auth';
import { validateRequestSearchParams } from '$lib/server/middlewares/validation';
import { getPaginationParamsFromSearchParams } from '$lib/utils/pagination';
import { json } from '@sveltejs/kit';

export const GET = async ({ url, locals }) => {
	const { orgId } = acl(locals);

	const pagination = getPaginationParamsFromSearchParams(url.searchParams);

	const filters = validateRequestSearchParams(url.searchParams, getTrackersSearchParamsSchema);

	const trackers = await findOrgTrackersWithPagination(orgId, { pagination, filters });

	return json(trackers);
};
