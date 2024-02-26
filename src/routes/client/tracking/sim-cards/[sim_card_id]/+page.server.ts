import { updateSimCardSchema } from '$lib/api/sim-card.schema';
import { getIntParameterFromRouteSlug } from '$lib/utils/server-load';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => ({
	simCardId: getIntParameterFromRouteSlug(params.sim_card_id, 'invalid SIM ID'),
	updateSimCardForm: await superValidate(zod(updateSimCardSchema))
});
