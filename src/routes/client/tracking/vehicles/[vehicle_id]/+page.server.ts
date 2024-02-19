import { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
import { createTrackerSchema, updateTrackerSchema } from '$lib/api/tracker.schema';
import { updateVehicleSchema } from '$lib/api/vehicle.schema';
import { getIntParameterFromRouteSlug } from '$lib/utils/server-load';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => ({
	vehicleId: getIntParameterFromRouteSlug(params.vehicle_id, 'invalid vehicle ID'),
	updateVehicleForm: await superValidate(updateVehicleSchema),
	createTrackerForm: await superValidate(createTrackerSchema),
	updateTrackerForm: await superValidate(updateTrackerSchema),
	createSimCardForm: await superValidate(createSimCardSchema),
	updateSimCardForm: await superValidate(updateSimCardSchema)
});
