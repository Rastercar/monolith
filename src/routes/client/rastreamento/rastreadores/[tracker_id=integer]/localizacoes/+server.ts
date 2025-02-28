import { getTrackerLocationsSearchParamsSchema } from '$lib/api/tracker.schema';
import { findOrgTrackerById, findTrackerLocationList } from '$lib/server/db/repo/vehicle-tracker';
import { acl } from '$lib/server/middlewares/auth';
import { validateRequestSearchParams } from '$lib/server/middlewares/validation';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals, params }) => {
	const { orgId } = acl(locals);

	const trackerId = parseInt(params.tracker_id);

	const filters = validateRequestSearchParams(
		url.searchParams,
		getTrackerLocationsSearchParamsSchema
	);

	// assert the tracker exists and belongs to the user org
	const tracker = await findOrgTrackerById({ id: trackerId, orgId });
	if (!tracker) return error(404);

	const positions = (await findTrackerLocationList(trackerId, filters)).map((p) => ({
		time: p.time,
		point: { lat: p.point[1], lng: p.point[0] }
	}));

	return json(positions);
};
