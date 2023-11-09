import { createTrackerSchema } from '$lib/api/tracker.schema';
import { createVehicleSchema } from '$lib/api/vehicle.schema';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const createVehicleForm = await superValidate(createVehicleSchema);
	const createTrackerForm = await superValidate(createTrackerSchema);

	return { createVehicleForm, createTrackerForm };
};
