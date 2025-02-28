import { createSimCardSchema, simCardSchema } from '$lib/api/sim-card.schema';
import { isErrorFromUniqueConstraint } from '$lib/server/db/error';
import { createOrgSimCard } from '$lib/server/db/repo/sim-card';
import { acl } from '$lib/server/middlewares/auth';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	createSimCardForm: await superValidate(zod(createSimCardSchema))
});

export const actions = {
	createSimCard: async ({ request, locals }) => {
		const { orgId } = acl(locals, { requiredPermissions: 'CREATE_SIM_CARD' });

		const form = await validateFormWithFailOnError(request, createSimCardSchema);

		const simOrError = await createOrgSimCard(orgId, form.data).catch((e) => {
			if (isErrorFromUniqueConstraint(e, 'sim_card_ssn_unique')) {
				return 'sim_card_ssn_unique' as const;
			}

			if (isErrorFromUniqueConstraint(e, 'sim_card_phone_number_unique')) {
				return 'sim_card_phone_number_unique' as const;
			}

			throw e;
		});

		if (simOrError === 'sim_card_phone_number_unique') {
			return setError(form, 'phoneNumber', 'Telefone em uso por outro cartão SIM');
		}

		if (simOrError === 'sim_card_ssn_unique') {
			return setError(form, 'ssn', 'SSN em uso por outro cartão SIM');
		}

		const createdSim = simCardSchema.parse(simOrError);
		return { form, createdSim };
	}
};
