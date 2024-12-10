import type { PaginationWithFilters } from '$lib/api/common';
import type { CreateVehicleBody, GetVehiclesFilters } from '$lib/api/vehicle.schema';
import { and, eq, ilike, type SQL } from 'drizzle-orm';
import { db } from '../db';
import type { Tx } from '../helpers';
import { paginate } from '../pagination';
import { vehicle } from '../schema';

export async function findOrgVehiclesWithPagination(
	orgId: number,
	params: PaginationWithFilters<GetVehiclesFilters>
) {
	const { pagination, filters } = params;

	const sqlFilters: SQL[] = [eq(vehicle.organizationId, orgId)];

	if (filters?.plate) sqlFilters.push(ilike(vehicle.plate, `%${filters.plate}%`));

	return paginate(pagination, vehicle, sqlFilters);
}

export function findOrgVehicleById(id: number, orgId: number) {
	return db.query.vehicle.findFirst({
		where: (vehicle, { eq, and }) => and(eq(vehicle.organizationId, orgId), eq(vehicle.id, id)),
		with: { vehicleTracker: true }
	});
}

export async function createOrgVehicle(
	orgId: number,
	body: Omit<CreateVehicleBody, 'photo'> & { photo?: string | null },
	tx?: Tx
) {
	const [createdVehicle] = await (db || tx)
		.insert(vehicle)
		.values({ ...body, organizationId: orgId })
		.returning();

	return createdVehicle;
}

export async function updateOrgVehiclePhoto(id: number, photo: string | null, tx?: Tx) {
	const [updatedVehicle] = await (db || tx)
		.update(vehicle)
		.set({ photo })
		.where(eq(vehicle.id, id))
		.returning();

	return updatedVehicle;
}

export function deleteOrgVehicleById(id: number, orgId: number) {
	return db.delete(vehicle).where(and(eq(vehicle.id, id), eq(vehicle.organizationId, orgId)));
}
