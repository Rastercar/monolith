import { createSimCardSchema } from '$lib/api/sim-card.schema';
import { createTrackerSchema } from '$lib/api/tracker.schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	createSimCardForm: await superValidate(zod(createSimCardSchema)),
	createTrackerForm: await superValidate(zod(createTrackerSchema))
});
