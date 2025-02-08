import { getTrackersPositionsSearchParamsSchema } from '$lib/api/tracker.schema';
import { filterVehicleTrackerIdsByAssertingBelongsToOrg } from '$lib/server/db/repo/vehicle-tracker';
import { findMultipleVehicleTrackerLastLocations } from '$lib/server/db/repo/vehicle-tracker-location';
import { acl } from '$lib/server/middlewares/auth';
import { validateJsonRequestBody } from '$lib/server/middlewares/validation';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
	const { user } = acl(locals);

	const { ids } = await validateJsonRequestBody(request, getTrackersPositionsSearchParamsSchema);

	const validIds = await filterVehicleTrackerIdsByAssertingBelongsToOrg(ids, user.organization.id);

	const dbPositions = await findMultipleVehicleTrackerLastLocations(validIds);

	const positions = dbPositions.map((p) => ({
		lng: p.point[0],
		lat: p.point[1],
		timestamp: p.time,
		trackerId: p.vehicleTrackerId
	}));

	return json(positions);
};
