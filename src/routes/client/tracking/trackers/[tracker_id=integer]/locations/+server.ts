import { getTrackerLocationsSearchParamsSchema } from '$lib/api/tracker.schema';
import { findOrgTrackerById, findTrackerLocationList } from '$lib/server/db/repo/tracker';
import { acl } from '$lib/server/middlewares/auth';
import { validateRequestSearchParams } from '$lib/server/middlewares/validation';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import type { RouteParams } from './$types';

export const GET: RequestHandler<RouteParams> = async ({ url, locals, params }) => {
	const { user } = acl(locals);

	const trackerId = parseInt(params.tracker_id);

	const filters = validateRequestSearchParams(
		url.searchParams,
		getTrackerLocationsSearchParamsSchema
	);

	// assert the tracker exists and belongs to the user org
	const tracker = await findOrgTrackerById(trackerId, user.organization.id);
	if (!tracker) return error(404);

	const positions = (await findTrackerLocationList(trackerId, filters)).map((p) => ({
		time: p.time,
		point: {
			lat: p.point[1], // lat
			lng: p.point[0] // lng
		}
	}));

	return json(positions);
};
