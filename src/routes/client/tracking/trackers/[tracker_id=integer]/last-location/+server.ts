import { findOrgTrackerById, findTrackerLastLocation } from '$lib/server/db/repo/tracker';
import { acl } from '$lib/server/middlewares/auth';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import type { RouteParams } from './$types';

export const GET: RequestHandler<RouteParams> = async ({ locals, params }) => {
	const { user } = acl(locals);

	const trackerId = parseInt(params.tracker_id);

	// assert the tracker exists and belongs to the user org
	const tracker = await findOrgTrackerById(trackerId, user.organization.id);
	if (!tracker) return error(404);

	const lastLocation = await findTrackerLastLocation(trackerId);

	if (!lastLocation) return json(null);

	return json({
		time: lastLocation.time,
		point: { lat: lastLocation.point[1], lng: lastLocation.point[0] }
	});
};
