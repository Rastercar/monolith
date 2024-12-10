import type {
	CreateAccessLevelBody,
	GetAccessLevelFilters,
	UpdateAccessLevelBody
} from '$lib/api/access-level.schema';
import type { PaginationWithFilters } from '$lib/api/common';
import { and, count, eq, ilike, SQL } from 'drizzle-orm';
import { db } from '../db';
import { paginate } from '../pagination';
import { accessLevel, user } from '../schema';

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

export async function countUsersUsingAccessLevel(id: number) {
	const [{ count: cnt }] = await db
		.select({ count: count() })
		.from(user)
		.where(eq(user.accessLevelId, id));

	return cnt;
}

export async function updateOrgAccessLevel(id: number, orgId: number, body: UpdateAccessLevelBody) {
	const [updatedAccessLevel] = await db
		.update(accessLevel)
		.set(body)
		.where(and(eq(accessLevel.id, id), eq(accessLevel.organizationId, orgId)))
		.returning();

	return updatedAccessLevel;
}

export async function createOrgAccessLevel(orgId: number, body: CreateAccessLevelBody) {
	const [createdAccessLevel] = await db
		.insert(accessLevel)
		.values({ ...body, organizationId: orgId, isFixed: false })
		.returning();

	return createdAccessLevel;
}

export function deleteOrgAccessLevelById(id: number, orgId: number) {
	return db
		.delete(accessLevel)
		.where(and(eq(accessLevel.id, id), eq(accessLevel.organizationId, orgId)));
}
