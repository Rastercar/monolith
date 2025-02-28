import { createVehicleSchema, vehicleSchema } from '$lib/api/vehicle.schema';
import { getDB } from '$lib/server/db/db';
import { isErrorFromUniqueConstraint } from '$lib/server/db/error';
import { createOrgVehicle, updateOrgVehiclePhoto } from '$lib/server/db/repo/vehicle';
import { acl } from '$lib/server/middlewares/auth';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { s3 } from '$lib/server/services/s3';
import path from 'path';
import { setError, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	createVehicleForm: await superValidate(zod(createVehicleSchema))
});

export const actions = {
	createVehicle: async ({ request, locals }) => {
		const { orgId } = acl(locals, { requiredPermissions: 'CREATE_VEHICLE' });

		const form = await validateFormWithFailOnError(request, createVehicleSchema);

		const { photo, ...data } = form.data;

		const createdVehicleOrError = await getDB().transaction(async (tx) => {
			const vehicleOrError = await createOrgVehicle(orgId, data, tx).catch((e) => {
				if (isErrorFromUniqueConstraint(e, 'vehicle_plate_unique')) {
					return 'vehicle_plate_unique' as const;
				}

				throw e;
			});

			if (typeof vehicleOrError === 'string') {
				tx.rollback();
				return vehicleOrError;
			}

			if (photo) {
				const key = {
					date: new Date(),
					organizationId: orgId,
					filenameWithExtension: `pic${path.extname(photo.name)}`,
					organizationSubFolder: `vehicle/${vehicleOrError.id}`
				};

				const { fileKey } = await s3.uploadFile(key, photo);
				await updateOrgVehiclePhoto(vehicleOrError.id, fileKey, tx);
			}

			return vehicleOrError;
		});

		if (createdVehicleOrError === 'vehicle_plate_unique') {
			return setError(form, 'plate', 'Placa em uso por outro veículo');
		}

		const createdVehicle = vehicleSchema.parse(createdVehicleOrError);

		return withFiles({ form, createdVehicle });
	}
};
