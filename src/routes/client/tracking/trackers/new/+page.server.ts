import { createSimCardSchema } from '$lib/api/sim-card.schema';
import { createTrackerSchema } from '$lib/api/tracker.schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	createSimCardForm: await superValidate(zod(createSimCardSchema)),
	createTrackerForm: await superValidate(zod(createTrackerSchema))
});
