import type { PaginationWithFilters } from '$lib/api/common';
import type {
	CreateVehicleBody,
	GetVehiclesFilters,
	UpdateVehicleBody
} from '$lib/api/vehicle.schema';
import { and, eq, type SQL } from 'drizzle-orm';
import { getDB } from '../db';
import { pushIlikeFilterIdDefined, type Tx } from '../helpers';
import { countRecords, getLimitOffset } from '../pagination';
import { vehicle } from '../schema';
import type { IdAndOrgId } from './utils';

export async function findOrgVehiclesWithPagination(
	orgId: number,
	params: PaginationWithFilters<GetVehiclesFilters>
) {
	const { pagination, filters } = params;
	const { page, pageSize } = pagination;

	const sqlFilters: SQL[] = [eq(vehicle.organizationId, orgId)];

	pushIlikeFilterIdDefined(sqlFilters, vehicle.plate, filters?.plate);

	const where = and(...sqlFilters);

	const records = await getDB().query.vehicle.findMany({
		orderBy: (vehicle, { asc }) => asc(vehicle.plate),
		...getLimitOffset(pagination),
		where,
		with: { fleet: true }
	});

	const itemCount = await countRecords(vehicle, where);

	const pageCount = Math.ceil(itemCount / pageSize);

	return { page, records, pageSize, pageCount, itemCount };
}

export function findOrgVehicleById({ id, orgId }: IdAndOrgId) {
	return getDB().query.vehicle.findFirst({
		where: (vehicle, { eq, and }) => and(eq(vehicle.organizationId, orgId), eq(vehicle.id, id)),
		with: {
			fleet: true,
			vehicleTracker: {
				with: { simCards: true }
			}
		}
	});
}

export async function createOrgVehicle(
	orgId: number,
	body: Omit<CreateVehicleBody, 'photo'> & { photo?: string | null },
	tx?: Tx
) {
	const [createdVehicle] = await (getDB() || tx)
		.insert(vehicle)
		.values({ ...body, organizationId: orgId })
		.returning();

	return createdVehicle;
}

export async function updateOrgVehicle({ id, orgId }: IdAndOrgId, body: UpdateVehicleBody) {
	const [updatedVehicle] = await getDB()
		.update(vehicle)
		.set(body)
		.where(and(eq(vehicle.id, id), eq(vehicle.organizationId, orgId)))
		.returning();

	return updatedVehicle;
}

export async function updateOrgVehiclePhoto(id: number, photo: string | null, tx?: Tx) {
	const [updatedVehicle] = await (getDB() || tx)
		.update(vehicle)
		.set({ photo })
		.where(eq(vehicle.id, id))
		.returning();

	return updatedVehicle;
}

export function deleteOrgVehicleById({ id, orgId }: IdAndOrgId) {
	return getDB()
		.delete(vehicle)
		.where(and(eq(vehicle.id, id), eq(vehicle.organizationId, orgId)));
}
