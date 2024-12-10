import type { CreateAccessLevelBody, GetAccessLevelFilters } from '$lib/api/access-level.schema';
import type { PaginationWithFilters } from '$lib/api/common';
import { eq, ilike, SQL } from 'drizzle-orm';
import { db } from '../db';
import { paginate } from '../pagination';
import { accessLevel } from '../schema';

export async function findOrgAccessLevelsWithPagination(
	orgId: number,
	params: PaginationWithFilters<GetAccessLevelFilters>
) {
	const { pagination, filters } = params;

	const sqlFilters: SQL[] = [eq(accessLevel.organizationId, orgId)];

	if (filters?.name) sqlFilters.push(ilike(accessLevel.name, `%${filters.name}%`));

	return paginate(pagination, accessLevel, sqlFilters);
}

export function findOrgAccessLevelById(id: number, orgId: number) {
	return db.query.accessLevel.findFirst({
		where: (accessLevel, { eq, and }) =>
			and(eq(accessLevel.organizationId, orgId), eq(accessLevel.id, id))
	});
}

export async function createOrgAccessLevel(orgId: number, body: CreateAccessLevelBody) {
	const [createdAccessLevel] = await db
		.insert(accessLevel)
		.values({ ...body, organizationId: orgId, isFixed: false })
		.returning();

	return createdAccessLevel;
}
