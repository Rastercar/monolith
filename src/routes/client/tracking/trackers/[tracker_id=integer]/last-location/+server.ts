import { findOrgTrackerById, findTrackerLastLocation } from '$lib/server/db/repo/vehicle-tracker';
import { acl } from '$lib/server/middlewares/auth';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
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
