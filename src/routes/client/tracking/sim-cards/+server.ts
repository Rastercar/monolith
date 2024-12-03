import { findOrgSimCardsWithPagination } from '$lib/server/db/repo/sim-card';
import { withAuth } from '$lib/server/middlewares/auth';
import { getPaginationParamsFromSearchParams } from '$lib/utils/pagination';
import { json } from '@sveltejs/kit';

export const GET = withAuth(async ({ url, locals }) => {
	const pagination = getPaginationParamsFromSearchParams(url.searchParams);

	// TODO: move query parsing to utils
	let withAssociatedTrackerQuery = url.searchParams.get('withAssociatedTracker');

	const withAssociatedTracker = withAssociatedTrackerQuery
		? withAssociatedTrackerQuery.toLowerCase() === 'true'
		: undefined;

	const simCards = await findOrgSimCardsWithPagination(locals.user.organization.id, {
		pagination,
		filters: {
			phoneNumber: url.searchParams.get('phoneNumber') ?? undefined,
			withAssociatedTracker
		}
	});

	return json(simCards);
});
