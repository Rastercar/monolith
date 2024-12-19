import { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
import { createTrackerSchema, updateTrackerSchema } from '$lib/api/tracker.schema';
import { updateVehicleSchema, vehicleSchema, type Vehicle } from '$lib/api/vehicle.schema';
import { isErrorFromUniqueConstraint } from '$lib/server/db/error.js';
import { findOrgVehicleById, updateOrgVehicle } from '$lib/server/db/repo/vehicle.js';
import { acl } from '$lib/server/middlewares/auth';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { error } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals }) => {
	const { user } = acl(locals);

	const vehicleId = parseInt(params.vehicle_id);
	const vehicleFromDb = await findOrgVehicleById(vehicleId, user.organization.id);

	if (!vehicleFromDb) return error(404);

	const vehicle = vehicleSchema.parse(vehicleFromDb);

	return {
		vehicle,
		updateVehicleForm: await superValidate(zod(updateVehicleSchema), { defaults: vehicle }),
		createTrackerForm: await superValidate(zod(createTrackerSchema)),
		updateTrackerForm: await superValidate(zod(updateTrackerSchema), {
			defaults: vehicle.vehicleTracker ?? undefined
		}),
		createSimCardForm: await superValidate(zod(createSimCardSchema)),
		updateSimCardForm: await superValidate(zod(updateSimCardSchema))
	};
};

export const actions = {
	updateVehicle: async ({ request, locals, params }) => {
		const { user } = acl(locals, { requiredPermissions: 'UPDATE_VEHICLE' });

		const vehicleId = parseInt(params.vehicle_id);

		const form = await validateFormWithFailOnError(request, updateVehicleSchema);

		const res = await updateOrgVehicle(vehicleId, user.organization.id, form.data)
			.then((vehicle) => vehicleSchema.parse(vehicle))
			.catch((e) => {
				if (isErrorFromUniqueConstraint(e, 'vehicle_plate_unique')) {
					return { error: 'PLATE_IN_USE' };
				}

				throw e;
			});

		if ('error' in res) {
			if (res.error === 'PLATE_IN_USE') {
				return setError(form, 'plate', 'Plate in use by another vehicle');
			}
		}

		return { form, updatedVehicle: res as Vehicle };
	}
};
