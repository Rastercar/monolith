import { updateSimCardSchema, type SimCard } from '$lib/api/sim-card.schema';
import { findOrgSimCardById as findOrgSimCardByID } from '$lib/server/db/repo/sim-card.js';
import { verifyUserHasPermissions } from '$lib/server/middlewares/auth';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { error } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { _updateSimCard } from './+server';

export const load = async ({ params, locals }) => {
	if (!locals.user) return error(403);

	const simCardId = parseInt(params.sim_card_id);
	const simCard = await findOrgSimCardByID(simCardId, locals.user.organization.id);

	if (!simCard) return error(404);

	const updateSimCardForm = await superValidate(zod(updateSimCardSchema), { defaults: simCard });

	return { simCard, updateSimCardForm };
};

export const actions = {
	updateSimCard: async ({ request, locals, params }) => {
		if (!locals.user) return error(400);
		verifyUserHasPermissions(locals.user, 'UPDATE_SIM_CARD');

		const simCardId = parseInt(params.sim_card_id);

		const form = await validateFormWithFailOnError(request, updateSimCardSchema);

		const res = await _updateSimCard(simCardId, locals.user.organization.id, form.data);

		if ('error' in res) {
			if (res.error === 'SSN_IN_USE') {
				return setError(form, 'ssn', 'SSN in use by another SIM card');
			}

			if (res.error === 'PHONE_IN_USE') {
				return setError(form, 'phoneNumber', 'Phone number in use by another SIM card');
			}
		}

		return { form, updatedSimCard: res as SimCard };
	}
};
