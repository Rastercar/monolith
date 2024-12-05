import type { PaginationWithFilters } from '$lib/api/common';
import type { GetTrackersFilters } from '$lib/api/tracker';
import type { CreateTrackerBody, UpdateTrackerBody } from '$lib/api/tracker.schema';
import { and, eq, ilike, isNotNull, isNull, type SQL } from 'drizzle-orm';
import { db } from '../db';
import { paginate } from '../pagination';
import { vehicleTracker } from '../schema';

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

export function findOrgTrackerById(id: number, orgId: number) {
	return db.query.vehicleTracker.findFirst({
		where: (vehicleTracker, { eq, and }) =>
			and(eq(vehicleTracker.organizationId, orgId), eq(vehicleTracker.id, id))
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
