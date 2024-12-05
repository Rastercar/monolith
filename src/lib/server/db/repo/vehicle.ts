import type { PaginationWithFilters } from '$lib/api/common';
import type { GetVehiclesFilters } from '$lib/api/vehicle.schema';
import { eq, ilike, type SQL } from 'drizzle-orm';
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
