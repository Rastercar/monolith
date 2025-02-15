import type { PaginationWithFilters } from '$lib/api/common';
import type { CreateFleetBody, GetFleetsFilters, UpdateFleetBody } from '$lib/api/fleet.schema';
import { and, eq, type SQL } from 'drizzle-orm';
import { getDB } from '../db';
import { pushIlikeFilterIdDefined } from '../helpers';
import { countRecords, getLimitOffset } from '../pagination';
import { fleet } from '../schema';
import type { IdAndOrgId } from './utils';

export async function findOrgFleetsWithPagination(
	orgId: number,
	params: PaginationWithFilters<GetFleetsFilters>
) {
	const { pagination, filters } = params;
	const { page, pageSize } = pagination;

	const sqlFilters: SQL[] = [eq(fleet.organizationId, orgId)];

	pushIlikeFilterIdDefined(sqlFilters, fleet.name, filters?.name);

	const where = and(...sqlFilters);

	const records = await getDB().query.fleet.findMany({
		orderBy: (fleet, { asc }) => asc(fleet.name),
		...getLimitOffset(pagination),
		where,
		with: { vehicles: true }
	});

	const itemCount = await countRecords(fleet, where);

	const pageCount = Math.ceil(itemCount / pageSize);

	return { page, records, pageSize, pageCount, itemCount };
}

export async function createOrgFleet(orgId: number, body: CreateFleetBody) {
	const [createdFleet] = await getDB()
		.insert(fleet)
		.values({ ...body, organizationId: orgId })
		.returning();

	return createdFleet;
}

export function findOrgFleetById({ id, orgId }: IdAndOrgId) {
	return getDB().query.fleet.findFirst({
		where: (fleet, { eq, and }) => and(eq(fleet.organizationId, orgId), eq(fleet.id, id)),
		with: { vehicles: true }
	});
}

export async function updateOrgFleet({ id, orgId }: IdAndOrgId, body: UpdateFleetBody) {
	const [updatedFleet] = await getDB()
		.update(fleet)
		.set(body)
		.where(and(eq(fleet.id, id), eq(fleet.organizationId, orgId)))
		.returning();

	return updatedFleet;
}

export function deleteFleetById({ id, orgId }: IdAndOrgId) {
	return getDB()
		.delete(fleet)
		.where(and(eq(fleet.id, id), eq(fleet.organizationId, orgId)));
}
