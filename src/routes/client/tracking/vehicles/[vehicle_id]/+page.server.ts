import { updateVehicleSchema } from '$lib/api/vehicle.schema';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const vehicleId = parseInt(params.vehicle_id);

	if (Number.isNaN(vehicleId)) {
		error(404, 'invalid vehicle ID');
	}

	const updateVehicleForm = await superValidate(updateVehicleSchema);
	return { vehicleId, updateVehicleForm };
};
