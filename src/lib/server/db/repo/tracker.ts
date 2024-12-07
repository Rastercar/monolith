import type { PaginationWithFilters } from '$lib/api/common';
import type {
	CreateTrackerBody,
	GetTrackerLocationsFilters,
	GetTrackersFilters,
	UpdateTrackerBody
} from '$lib/api/tracker.schema';
import { and, asc, eq, gt, ilike, isNotNull, isNull, lt, type SQL } from 'drizzle-orm';
import { db } from '../db';
import { getISOFormatDateQuery } from '../helpers';
import { paginate } from '../pagination';
import {
	simCard,
	vehicleTracker,
	vehicleTrackerLastLocation,
	vehicleTrackerLocation
} from '../schema';

export async function findOrgTrackersWithPagination(
	orgId: number,
	params: PaginationWithFilters<GetTrackersFilters>
) {
	const { pagination, filters } = params;

	const sqlFilters: SQL[] = [eq(vehicleTracker.organizationId, orgId)];

	if (filters?.imei) sqlFilters.push(ilike(vehicleTracker.imei, `%${filters.imei}%`));

	if (filters?.withAssociatedVehicle !== undefined) {
		const filter = filters.withAssociatedVehicle
			? isNotNull(vehicleTracker.vehicleId)
			: isNull(vehicleTracker.vehicleId);

		sqlFilters.push(filter);
	}

	return paginate(pagination, vehicleTracker, sqlFilters);
}

export async function findTrackerLocationList(id: number, options: GetTrackerLocationsFilters) {
	const sqlFilters: SQL[] = [eq(vehicleTrackerLocation.vehicleTrackerId, id)];

	if (options.before) {
		sqlFilters.push(lt(vehicleTrackerLocation.time, options.before));
	}

	if (options.after) {
		sqlFilters.push(gt(vehicleTrackerLocation.time, options.after));
	}

	return db
		.select({
			time: getISOFormatDateQuery(vehicleTrackerLocation.time),
			point: vehicleTrackerLocation.point
		})
		.from(vehicleTrackerLocation)
		.where(and(...sqlFilters))
		.limit(options.limit)
		.orderBy(asc(vehicleTrackerLocation.time));
}

export async function findTrackerLastLocation(id: number) {
	const locations = await db
		.select({
			time: getISOFormatDateQuery(vehicleTrackerLastLocation.time),
			point: vehicleTrackerLastLocation.point
		})
		.from(vehicleTrackerLastLocation)
		.where(eq(vehicleTrackerLastLocation.vehicleTrackerId, id))
		.limit(1);

	return locations.length === 0 ? null : locations[0];
}

export function findOrgTrackerById(id: number, orgId: number) {
	return db.query.vehicleTracker.findFirst({
		where: (vehicleTracker, { eq, and }) =>
			and(eq(vehicleTracker.organizationId, orgId), eq(vehicleTracker.id, id)),
		with: {
			vehicle: true,
			simCards: true
		}
	});
}

export async function createOrgTracker(orgId: number, body: CreateTrackerBody) {
	const [createdTracker] = await db
		.insert(vehicleTracker)
		.values({ ...body, organizationId: orgId })
		.returning();

	return createdTracker;
}

export async function updateOrgTracker(id: number, orgId: number, body: UpdateTrackerBody) {
	const [updatedTracker] = await db
		.update(vehicleTracker)
		.set(body)
		.where(and(eq(vehicleTracker.id, id), eq(vehicleTracker.organizationId, orgId)))
		.returning();

	return updatedTracker;
}

export function deleteOrgTrackerById(id: number, orgId: number, deleteAssociatedSimCards: boolean) {
	return db.transaction(async (tx) => {
		if (deleteAssociatedSimCards) {
			await tx
				.delete(simCard)
				.where(and(eq(simCard.vehicleTrackerId, id), eq(simCard.organizationId, orgId)));
		}

		await tx
			.delete(vehicleTracker)
			.where(and(eq(vehicleTracker.id, id), eq(vehicleTracker.organizationId, orgId)));

		// if there was a deleted tracker, we know it belongs to the user org so
		// we delete from the vehicle tracker location manually since this
		// table does not have a FK with ON DELETE CASCADE; to the vehicle_tracker
		// table for performance reasons
		await tx.delete(vehicleTrackerLocation).where(eq(vehicleTrackerLocation.vehicleTrackerId, id));
	});
}
