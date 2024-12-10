import { getVehiclesSearchParamsSchema } from '$lib/api/vehicle.schema';
import { findOrgVehiclesWithPagination } from '$lib/server/db/repo/vehicle';
import { acl } from '$lib/server/middlewares/auth';
import { validateRequestSearchParams } from '$lib/server/middlewares/validation';
import { getPaginationParamsFromSearchParams } from '$lib/utils/pagination';
import { json } from '@sveltejs/kit';

export const GET = async ({ url, locals }) => {
	const { user } = acl(locals);

	const pagination = getPaginationParamsFromSearchParams(url.searchParams);

	const filters = validateRequestSearchParams(url.searchParams, getVehiclesSearchParamsSchema);

	const vehicles = await findOrgVehiclesWithPagination(user.organization.id, {
		filters,
		pagination
	});

	return json(vehicles);
};
