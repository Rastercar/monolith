import { updateSimCardSchema } from '$lib/api/sim-card.schema';
import { getIntParameterFromRouteSlug } from '$lib/utils/routes';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params }) => ({
	simCardId: getIntParameterFromRouteSlug(params.sim_card_id, 'invalid SIM ID'),
	updateSimCardForm: await superValidate(zod(updateSimCardSchema))
});
