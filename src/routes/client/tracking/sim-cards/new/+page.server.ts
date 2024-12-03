import { createSimCardSchema, simCardSchema } from '$lib/api/sim-card.schema';
import { isErrorFromUniqueConstraint } from '$lib/server/db/error';
import { createOrgSimCard } from '$lib/server/db/repo/sim-card';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { error } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	createSimCardForm: await superValidate(zod(createSimCardSchema))
});

export const actions = {
	createSimCard: async ({ request, locals }) => {
		if (!locals.user) return error(400);

		const form = await validateFormWithFailOnError(request, createSimCardSchema);

		const sim = await createOrgSimCard(locals.user.organization.id, form.data).catch((e) => {
			if (isErrorFromUniqueConstraint(e, 'sim_card_ssn_unique')) {
				return setError(form, 'ssn', 'SSN in use by another SIM card');
			}

			if (isErrorFromUniqueConstraint(e, 'sim_card_phone_number_unique')) {
				return setError(form, 'phoneNumber', 'Phone number in use by another SIM card');
			}

			throw e;
		});

		const createdSim = simCardSchema.parse(sim);

		return { form, createdSim };
	}
};
