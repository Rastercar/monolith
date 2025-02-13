import type { PaginationWithFilters } from '$lib/api/common';
import type { CreateFleetBody, GetFleetsFilters, UpdateFleetBody } from '$lib/api/fleet.schema';
import { and, eq, type SQL } from 'drizzle-orm';
import { getDB } from '../db';
import { pushIlikeFilterIdDefined } from '../helpers';
import { paginate } from '../pagination';
import { fleet } from '../schema';

// TODO: create tests
export async function findOrgFleetsWithPagination(
	orgId: number,
	params: PaginationWithFilters<GetFleetsFilters>
) {
	const { pagination, filters } = params;

	const sqlFilters: SQL[] = [eq(fleet.organizationId, orgId)];

	pushIlikeFilterIdDefined(sqlFilters, fleet.name, filters?.name);

	return paginate(fleet, { orderBy: fleet.name, pagination, where: and(...sqlFilters) });
}

// TODO: create tests
export async function createOrgFleet(orgId: number, body: CreateFleetBody) {
	const [createdFleet] = await getDB()
		.insert(fleet)
		.values({ ...body, organizationId: orgId })
		.returning();

	return createdFleet;
}

// TODO: create tests
export function findOrgFleetById(id: number, orgId: number) {
	return getDB().query.fleet.findFirst({
		where: (fleet, { eq, and }) => and(eq(fleet.organizationId, orgId), eq(fleet.id, id))
	});
}

// TODO: create tests
export async function updateOrgFleet(id: number, orgId: number, body: UpdateFleetBody) {
	const [updatedFleet] = await getDB()
		.update(fleet)
		.set(body)
		.where(and(eq(fleet.id, id), eq(fleet.organizationId, orgId)))
		.returning();

	return updatedFleet;
}

// TODO: create tests
export function deleteFleetById(id: number, orgId: number) {
	return getDB()
		.delete(fleet)
		.where(and(eq(fleet.id, id), eq(fleet.organizationId, orgId)));
}
