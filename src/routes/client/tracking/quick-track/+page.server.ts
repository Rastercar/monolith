import { createSimCardSchema } from '$lib/api/sim-card.schema';
import { createTrackerSchema } from '$lib/api/tracker.schema';
import { createVehicleSchema } from '$lib/api/vehicle.schema';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const createVehicleForm = await superValidate(createVehicleSchema);
	const createTrackerForm = await superValidate(createTrackerSchema);
	const createSimCardForm = await superValidate(createSimCardSchema);

	return { createVehicleForm, createTrackerForm, createSimCardForm };
};
