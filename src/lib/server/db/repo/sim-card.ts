import type { PaginationWithFilters } from '$lib/api/common';
import type { GetSimCardsFilters } from '$lib/api/sim-card';
import { and, count, eq, ilike, SQL } from 'drizzle-orm';
import { db } from '../db';
import { simCard } from '../schema';

// TODO: filtering
//
// TODO: migrate DB pagination to utils
//
// TODO: see https://orm.drizzle.team/docs/dynamic-query-building
export async function findOrgSimCardsWithPagination(
	orgId: number,
	params: PaginationWithFilters<GetSimCardsFilters>
) {
	const { pagination, filters } = params;
	const { page, pageSize } = pagination;

	// TODO: move to utils
	const [{ count: rowCount }] = await db.select({ count: count() }).from(simCard);

	const sqlFilters: SQL[] = [eq(simCard.organizationId, orgId)];
	if (filters?.phoneNumber) sqlFilters.push(ilike(simCard.phoneNumber, `%${filters.phoneNumber}%`));

	const records = await db
		.select()
		.from(simCard)
		.where(and(...sqlFilters))
		.limit(pageSize)
		.offset((page - 1) * pageSize);

	return {
		page,
		records,
		pageSize,
		pageCount: Math.ceil(rowCount / pageSize),
		itemCount: records.length
	};
}
