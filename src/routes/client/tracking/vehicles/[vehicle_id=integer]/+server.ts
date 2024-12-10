import { deleteOrgVehicleById, findOrgVehicleById } from '$lib/server/db/repo/vehicle';
import { withAuth } from '$lib/server/middlewares/auth';
import { s3 } from '$lib/server/services/s3';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import type { RouteParams } from './$types';

export const DELETE: RequestHandler<RouteParams> = withAuth(async ({ params, locals }) => {
	const vehicleId = parseInt(params.vehicle_id);

	const vehicleToDelete = await findOrgVehicleById(vehicleId, locals.user.organization.id);
	if (!vehicleToDelete) return error(404);

	await deleteOrgVehicleById(vehicleId, locals.user.organization.id);
	if (vehicleToDelete.photo) await s3.deleteFile(vehicleToDelete.photo);

	return json('vehicle deleted');
});
