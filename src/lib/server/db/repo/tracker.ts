import type { PaginationWithFilters } from '$lib/api/common';
import type { GetTrackersFilters } from '$lib/api/tracker';
import type { CreateTrackerBody, UpdateTrackerBody } from '$lib/api/tracker.schema';
import { and, eq, ilike, type SQL } from 'drizzle-orm';
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

	return paginate(pagination, vehicleTracker, sqlFilters);
}

export async function createOrgTracker(orgId: number, body: CreateTrackerBody) {
	const [createdTracker] = await db
		.insert(vehicleTracker)
		.values({ ...body, organizationId: orgId })
		.returning();

	return createdTracker;
}

export function updateOrgTracker(id: number, orgId: number, body: UpdateTrackerBody) {
	return db
		.update(vehicleTracker)
		.set(body)
		.where(and(eq(vehicleTracker.id, id), eq(vehicleTracker.organizationId, orgId)));
}
