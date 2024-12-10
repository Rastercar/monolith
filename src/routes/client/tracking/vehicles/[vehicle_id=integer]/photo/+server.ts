import { imageSchema } from '$lib/api/common.schema';
import { findOrgVehicleById, updateOrgVehiclePhoto } from '$lib/server/db/repo/vehicle';
import { withAuth } from '$lib/server/middlewares/auth';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { s3 } from '$lib/server/services/s3';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import path from 'path';
import type { RouteParams } from './$types';

export const PUT: RequestHandler<RouteParams> = withAuth(
	async ({ request, params, locals: { user } }) => {
		const { data } = await validateFormWithFailOnError(request, imageSchema);
		const vehicleId = parseInt(params.vehicle_id);

		const vehicle = await findOrgVehicleById(vehicleId, user.organization.id);
		if (!vehicle) return error(404, 'vehicle not found');

		const oldVehiclePhoto = vehicle.photo;

		const key = {
			date: new Date(),
			organizationId: user.organization.id,
			filenameWithExtension: `pic${path.extname(data.image.name)}`,
			organizationSubFolder: `vehicle/${vehicle.id}`
		};

		const { fileKey } = await s3.uploadFile(key, data.image);
		await updateOrgVehiclePhoto(vehicleId, fileKey);

		// do this only after the new one has been uploaded
		if (oldVehiclePhoto) await s3.deleteFile(oldVehiclePhoto);

		return json(fileKey);
	}
);

export const DELETE: RequestHandler<RouteParams> = withAuth(
	async ({ locals: { user }, params }) => {
		const vehicleId = parseInt(params.vehicle_id);

		const vehicle = await findOrgVehicleById(vehicleId, user.organization.id);
		if (!vehicle) return error(404, 'vehicle not found');

		if (!vehicle.photo) {
			return json('vehicle does not have a photo to delete');
		}

		await s3.deleteFile(vehicle.photo);
		await updateOrgVehiclePhoto(vehicleId, null);

		return json('photo deleted');
	}
);
