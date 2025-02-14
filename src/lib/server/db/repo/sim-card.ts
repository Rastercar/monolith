import type { PaginationWithFilters } from '$lib/api/common';
import type {
	CreateSimCardBody,
	GetSimCardsFilters,
	UpdateSimCardBody
} from '$lib/api/sim-card.schema';
import { and, eq, isNotNull, isNull, SQL } from 'drizzle-orm';
import { getDB } from '../db';
import { pushIlikeFilterIdDefined } from '../helpers';
import { paginate } from '../pagination';
import { simCard } from '../schema';
import type { IdAndOrgId } from './utils';

export async function findOrgSimCardsWithPagination(
	orgId: number,
	params: PaginationWithFilters<GetSimCardsFilters>
) {
	const { pagination, filters } = params;

	const sqlFilters: SQL[] = [eq(simCard.organizationId, orgId)];

	pushIlikeFilterIdDefined(sqlFilters, simCard.phoneNumber, filters?.phoneNumber);

	if (filters?.withAssociatedTracker !== undefined) {
		const filter = filters.withAssociatedTracker
			? isNotNull(simCard.vehicleTrackerId)
			: isNull(simCard.vehicleTrackerId);

		sqlFilters.push(filter);
	}

	return paginate(simCard, { pagination, where: and(...sqlFilters) });
}

export function findOrgSimCardById({ id, orgId }: IdAndOrgId) {
	return getDB().query.simCard.findFirst({
		where: (simCard, { eq, and }) => and(eq(simCard.organizationId, orgId), eq(simCard.id, id))
	});
}

export function findOrgSimCardsByVehicleTrackerId({ id, orgId }: IdAndOrgId) {
	return getDB().query.simCard.findMany({
		where: (simCard, { eq, and }) =>
			and(eq(simCard.vehicleTrackerId, id), eq(simCard.organizationId, orgId))
	});
}

export async function updateOrgSimCard({ id, orgId }: IdAndOrgId, body: UpdateSimCardBody) {
	const [updatedSimCard] = await getDB()
		.update(simCard)
		.set(body)
		.where(and(eq(simCard.id, id), eq(simCard.organizationId, orgId)))
		.returning();

	return updatedSimCard;
}

export async function createOrgSimCard(orgId: number, body: CreateSimCardBody) {
	const [createdSimCard] = await getDB()
		.insert(simCard)
		.values({ ...body, organizationId: orgId })
		.returning();

	return createdSimCard;
}

export function deleteOrgSimCardById({ id, orgId }: IdAndOrgId) {
	return getDB()
		.delete(simCard)
		.where(and(eq(simCard.id, id), eq(simCard.organizationId, orgId)));
}
