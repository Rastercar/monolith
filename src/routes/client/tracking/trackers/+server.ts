import { findOrgTrackersWithPagination } from '$lib/server/db/repo/tracker';
import { withAuth } from '$lib/server/middlewares/auth';
import { getPaginationParamsFromSearchParams } from '$lib/utils/pagination';
import { json } from '@sveltejs/kit';

export const GET = withAuth(async ({ url, locals }) => {
	const pagination = getPaginationParamsFromSearchParams(url.searchParams);

	const trackers = await findOrgTrackersWithPagination(locals.user.organization.id, {
		pagination,
		filters: {
			// TODO: move query parsing to utils
			imei: url.searchParams.get('imei') ?? undefined
		}
	});

	return json(trackers);
});
