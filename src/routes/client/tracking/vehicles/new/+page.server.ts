import { createVehicleSchema, vehicleSchema } from '$lib/api/vehicle.schema';
import { isErrorFromUniqueConstraint } from '$lib/server/db/error';
import { createOrgVehicle } from '$lib/server/db/repo/vehicle';
import { verifyUserHasPermissions } from '$lib/server/middlewares/auth.js';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { error } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	createVehicleForm: await superValidate(zod(createVehicleSchema))
});

export const actions = {
	createVehicle: async ({ request, locals }) => {
		if (!locals.user) return error(400);
		verifyUserHasPermissions(locals.user, 'CREATE_VEHICLE');

		const form = await validateFormWithFailOnError(request, createVehicleSchema);

		try {
			const { photo, ...data } = form.data;

			// TODO: upload photo

			const vehicle = await createOrgVehicle(locals.user.organization.id, data);
			const createdVehicle = vehicleSchema.parse(vehicle);
			return { form, createdVehicle };
		} catch (e) {
			if (isErrorFromUniqueConstraint(e, 'vehicle_plate_unique')) {
				return setError(form, 'plate', 'Plate in use by another vehicle');
			}

			throw e;
		}
	}
};
