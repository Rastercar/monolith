import { createSimCardSchema } from '$lib/api/sim-card.schema';
import { createTrackerSchema } from '$lib/api/tracker.schema';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	createSimCardForm: await superValidate(createSimCardSchema),
	createTrackerForm: await superValidate(createTrackerSchema)
});
