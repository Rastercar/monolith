import { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
import { updateTrackerSchema } from '$lib/api/tracker.schema';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const vehicleTrackerId = parseInt(params.tracker_id);

	if (Number.isNaN(vehicleTrackerId)) {
		error(404, 'invalid tracker ID');
	}

	return {
		vehicleTrackerId,
		updateTrackerForm: await superValidate(updateTrackerSchema),
		createSimCardForm: await superValidate(createSimCardSchema),
		updateSimCardForm: await superValidate(updateSimCardSchema)
	};
};
