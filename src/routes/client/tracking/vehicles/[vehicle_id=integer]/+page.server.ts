import { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
import { createTrackerSchema, updateTrackerSchema } from '$lib/api/tracker.schema';
import { updateVehicleSchema } from '$lib/api/vehicle.schema';
import { getIntParameterFromRouteSlug } from '$lib/utils/routes';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params }) => ({
	vehicleId: getIntParameterFromRouteSlug(params.vehicle_id, 'invalid vehicle ID'),
	updateVehicleForm: await superValidate(zod(updateVehicleSchema)),
	createTrackerForm: await superValidate(zod(createTrackerSchema)),
	updateTrackerForm: await superValidate(zod(updateTrackerSchema)),
	createSimCardForm: await superValidate(zod(createSimCardSchema)),
	updateSimCardForm: await superValidate(zod(updateSimCardSchema))
});
