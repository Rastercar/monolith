import { findOrgSimCardsWithPagination } from '$lib/server/db/repo/sim-card';
import { withAuth } from '$lib/server/middlewares/auth';
import { json } from '@sveltejs/kit';

// TODO: move me to a utils fn
function getPaginationParamsFromSearchParams(params: URLSearchParams) {
	return {
		page: parseInt(params.get('page') ?? '1'),
		pageSize: parseInt(params.get('pageSize') ?? '5')
	};
}

export const GET = withAuth(async ({ url, locals }) => {
	const pagination = getPaginationParamsFromSearchParams(url.searchParams);

	const simCards = await findOrgSimCardsWithPagination(locals.user.organization.id, {
		pagination,
		filters: {
			// TODO: move query parsing to utils
			// TODO: handle withAssociatedTracker card
			phoneNumber: url.searchParams.get('phoneNumber') ?? undefined
		}
	});

	return json(simCards);
});
