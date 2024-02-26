import { createSimCardSchema } from '$lib/api/sim-card.schema';
import { createTrackerSchema } from '$lib/api/tracker.schema';
import { createVehicleSchema } from '$lib/api/vehicle.schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const createVehicleForm = await superValidate(zod(createVehicleSchema));
	const createTrackerForm = await superValidate(zod(createTrackerSchema));
	const createSimCardForm = await superValidate(zod(createSimCardSchema));

	return { createVehicleForm, createTrackerForm, createSimCardForm };
};
