import type {
	CreateAccessLevelBody,
	GetAccessLevelFilters,
	UpdateAccessLevelBody
} from '$lib/api/access-level.schema';
import type { PaginationWithFilters } from '$lib/api/common';
import { and, count, eq, SQL } from 'drizzle-orm';
import { getDB } from '../db';
import { pushIlikeFilterIdDefined } from '../helpers';
import { paginate } from '../pagination';
import { accessLevel, user } from '../schema';

export async function findOrgAccessLevelsWithPagination(
	orgId: number,
	params: PaginationWithFilters<GetAccessLevelFilters>
) {
	const { pagination, filters } = params;

	const sqlFilters: SQL[] = [eq(accessLevel.organizationId, orgId)];

	pushIlikeFilterIdDefined(sqlFilters, accessLevel.name, filters?.name);

	return paginate(accessLevel, {
		pagination,
		where: and(...sqlFilters),
		orderBy: accessLevel.id
	});
}

export function findOrgAccessLevelById(id: number, orgId: number) {
	return getDB().query.accessLevel.findFirst({
		where: (accessLevel, { eq, and }) =>
			and(eq(accessLevel.organizationId, orgId), eq(accessLevel.id, id))
	});
}

export async function countUsersUsingAccessLevel(id: number) {
	const [{ count: cnt }] = await getDB()
		.select({ count: count() })
		.from(user)
		.where(eq(user.accessLevelId, id));

	return cnt;
}

export async function updateOrgAccessLevel(id: number, orgId: number, body: UpdateAccessLevelBody) {
	const [updatedAccessLevel] = await getDB()
		.update(accessLevel)
		.set(body)
		.where(and(eq(accessLevel.id, id), eq(accessLevel.organizationId, orgId)))
		.returning();

	return updatedAccessLevel;
}

export async function createOrgAccessLevel(orgId: number, body: CreateAccessLevelBody) {
	const [createdAccessLevel] = await getDB()
		.insert(accessLevel)
		.values({ ...body, organizationId: orgId, isFixed: false })
		.returning();

	return createdAccessLevel;
}

export function deleteOrgAccessLevelById(id: number, orgId: number) {
	return getDB()
		.delete(accessLevel)
		.where(and(eq(accessLevel.id, id), eq(accessLevel.organizationId, orgId)));
}
