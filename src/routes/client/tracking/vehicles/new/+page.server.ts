import { createVehicleSchema } from '$lib/api/vehicle.schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	createVehicleForm: await superValidate(zod(createVehicleSchema))
});
