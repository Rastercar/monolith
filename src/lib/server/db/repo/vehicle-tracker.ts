import { and, eq, inArray } from 'drizzle-orm';
import { db } from '../db';
import { vehicleTracker } from '../schema';

/**
 * Given an array of tracker ids, return only the ones that
 * belongs to a organization with a given ID
 */
export async function filterVehicleTrackerIdsByAssertingBelongsToOrg(
	trackerIds: number[],
	orgId: number
) {
	const result = await db
		.select({ id: vehicleTracker.id })
		.from(vehicleTracker)
		.where(and(inArray(vehicleTracker.id, trackerIds), eq(vehicleTracker.organizationId, orgId)));

	return result.map((row) => row.id);
}
