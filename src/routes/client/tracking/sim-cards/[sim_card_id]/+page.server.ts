import { updateSimCardSchema } from '$lib/api/sim-card.schema';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const simCardId = parseInt(params.sim_card_id);

	if (Number.isNaN(simCardId)) {
		error(404, 'invalid SIM ID');
	}

	return {
		simCardId,
		updateSimCardForm: await superValidate(updateSimCardSchema)
	};
};
