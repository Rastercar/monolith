import { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
import { createTrackerSchema, updateTrackerSchema } from '$lib/api/tracker.schema';
import { updateVehicleSchema, vehicleSchema } from '$lib/api/vehicle.schema';
import { findOrgVehicleById } from '$lib/server/db/repo/vehicle.js';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals }) => {
	if (!locals.user) return error(403);

	const vehicleId = parseInt(params.vehicle_id);
	const vehicleFromDb = await findOrgVehicleById(vehicleId, locals.user.organization.id);

	if (!vehicleFromDb) return error(404);

	const vehicle = vehicleSchema.parse(vehicleFromDb);

	return {
		vehicle,
		updateVehicleForm: await superValidate(zod(updateVehicleSchema)),
		createTrackerForm: await superValidate(zod(createTrackerSchema)),
		updateTrackerForm: await superValidate(zod(updateTrackerSchema)),
		createSimCardForm: await superValidate(zod(createSimCardSchema)),
		updateSimCardForm: await superValidate(zod(updateSimCardSchema))
	};
};
