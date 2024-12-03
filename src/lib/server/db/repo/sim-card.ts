import type { PaginationWithFilters } from '$lib/api/common';
import type { GetSimCardsFilters } from '$lib/api/sim-card';
import type { CreateSimCardBody, UpdateSimCardBody } from '$lib/api/sim-card.schema';
import { and, eq, ilike, isNotNull, isNull, SQL } from 'drizzle-orm';
import { db } from '../db';
import { paginate } from '../pagination';
import { simCard } from '../schema';

export async function findOrgSimCardsWithPagination(
	orgId: number,
	params: PaginationWithFilters<GetSimCardsFilters>
) {
	const { pagination, filters } = params;

	const sqlFilters: SQL[] = [eq(simCard.organizationId, orgId)];

	if (filters?.phoneNumber) {
		sqlFilters.push(ilike(simCard.phoneNumber, `%${filters.phoneNumber}%`));
	}

	if (filters?.withAssociatedTracker !== undefined) {
		const filter = filters.withAssociatedTracker
			? isNotNull(simCard.vehicleTrackerId)
			: isNull(simCard.vehicleTrackerId);

		sqlFilters.push(filter);
	}

	return paginate(pagination, simCard, sqlFilters);
}

export function findOrgSimCardById(id: number, orgId: number) {
	return db.query.simCard.findFirst({
		where: (simCard, { eq, and }) => and(eq(simCard.organizationId, orgId), eq(simCard.id, id))
	});
}

export function deleteOrgSimCardById(id: number, orgId: number) {
	return db.delete(simCard).where(and(eq(simCard.id, id), eq(simCard.organizationId, orgId)));
}

export function updateOrgSimCard(id: number, orgId: number, body: UpdateSimCardBody) {
	return db
		.update(simCard)
		.set(body)
		.where(and(eq(simCard.id, id), eq(simCard.organizationId, orgId)));
}

export async function createOrgSimCard(orgId: number, body: CreateSimCardBody) {
	const [createdSimCard] = await db
		.insert(simCard)
		.values({ ...body, organizationId: orgId })
		.returning();

	return createdSimCard;
}
