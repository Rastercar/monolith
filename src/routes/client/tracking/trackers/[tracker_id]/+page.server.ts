import { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
import { updateTrackerSchema } from '$lib/api/tracker.schema';
import { getIntParameterFromRouteSlug } from '$lib/utils/server-load';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => ({
	vehicleTrackerId: getIntParameterFromRouteSlug(params.tracker_id, 'invalid tracker ID'),
	updateTrackerForm: await superValidate(updateTrackerSchema),
	createSimCardForm: await superValidate(createSimCardSchema),
	updateSimCardForm: await superValidate(updateSimCardSchema)
});
