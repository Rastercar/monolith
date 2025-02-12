import { vehicleSchema } from '$lib/api/vehicle.schema';
import { deleteOrgVehicleById, findOrgVehicleById } from '$lib/server/db/repo/vehicle';
import { acl } from '$lib/server/middlewares/auth';
import { s3 } from '$lib/server/services/s3';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { user } = acl(locals, { requiredPermissions: 'DELETE_VEHICLE' });

	const vehicleId = parseInt(params.vehicle_id);

	const vehicleToDelete = await findOrgVehicleById(vehicleId, user.organization.id);
	if (!vehicleToDelete) return error(404);

	await deleteOrgVehicleById(vehicleId, user.organization.id);
	if (vehicleToDelete.photo) await s3.deleteFile(vehicleToDelete.photo);

	return json('vehicle deleted');
};

export const GET: RequestHandler = async ({ params, locals }) => {
	const { user } = acl(locals);

	const vehicleId = parseInt(params.vehicle_id);
	const vehicleFromDb = await findOrgVehicleById(vehicleId, user.organization.id);

	if (!vehicleFromDb) return error(404);

	const vehicle = vehicleSchema.parse(vehicleFromDb);
	return json(vehicle);
};
