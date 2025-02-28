import { imageSchema } from '$lib/api/common.schema';
import { findOrgVehicleById, updateOrgVehiclePhoto } from '$lib/server/db/repo/vehicle';
import { acl } from '$lib/server/middlewares/auth';
import { validateForm } from '$lib/server/middlewares/validation';
import { s3 } from '$lib/server/services/s3';
import { error, json } from '@sveltejs/kit';
import path from 'path';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	const { orgId } = acl(locals, { requiredPermissions: 'UPDATE_VEHICLE' });

	const form = await validateForm(request, imageSchema);
	if (!form.valid) {
		error(400, { message: form.errors.image?.[0] ?? 'imagem inválida' });
	}

	const { image } = form.data;

	const vehicleId = parseInt(params.vehicle_id);

	const vehicle = await findOrgVehicleById({ id: vehicleId, orgId });
	if (!vehicle) return error(404, 'veículo não encontrado');

	const oldVehiclePhoto = vehicle.photo;

	const key = {
		date: new Date(),
		organizationId: orgId,
		filenameWithExtension: `pic${path.extname(image.name)}`,
		organizationSubFolder: `vehicle/${vehicle.id}`
	};

	const { fileKey } = await s3.uploadFile(key, image);
	await updateOrgVehiclePhoto(vehicleId, fileKey);

	// do this only after the new one has been uploaded
	if (oldVehiclePhoto) await s3.deleteFile(oldVehiclePhoto);

	return json(fileKey);
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const { orgId } = acl(locals, { requiredPermissions: 'UPDATE_VEHICLE' });

	const vehicleId = parseInt(params.vehicle_id);

	const vehicle = await findOrgVehicleById({ id: vehicleId, orgId });
	if (!vehicle) return error(404, 'veóculo não encontrado');

	if (!vehicle.photo) {
		return json('veículo sem foto para deletar');
	}

	await s3.deleteFile(vehicle.photo);
	await updateOrgVehiclePhoto(vehicleId, null);

	return json('foto deletada');
};
