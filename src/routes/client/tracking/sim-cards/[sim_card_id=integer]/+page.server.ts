import { updateSimCardSchema } from '$lib/api/sim-card.schema';
import { isUniqueConstraintError } from '$lib/server/db/error.js';
import {
	findOrgSimCardById as findOrgSimCardByID,
	updateOrgSimCard
} from '$lib/server/db/repo/sim-card.js';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { error } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { message } from 'sveltekit-superforms/server';

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

		const simCardId = parseInt(params.sim_card_id);

		const form = await validateFormWithFailOnError(request, updateSimCardSchema);

		await updateOrgSimCard(simCardId, locals.user.organization.id, form.data).catch((e) => {
			if (isUniqueConstraintError(e) && e.constraint_name === 'sim_card_ssn_unique') {
				return setError(form, 'ssn', 'SSN in use by another SIM card');
			}

			if (isUniqueConstraintError(e) && e.constraint_name === 'sim_card_phone_number_unique') {
				return setError(form, 'phoneNumber', 'Phone number in use by another SIM card');
			}

			throw e;
		});

		return message(form, { type: 'success', text: 'sim card updated' });
	}
};
