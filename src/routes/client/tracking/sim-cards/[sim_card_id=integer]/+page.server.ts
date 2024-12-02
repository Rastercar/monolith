import { updateSimCardSchema } from '$lib/api/sim-card.schema';
import {
	findOrgSimCardById as findOrgSimCardByID,
	updateOrgSimCard
} from '$lib/server/db/repo/sim-card.js';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals }) => {
	if (!locals.user) return error(403);

	const simCardId = parseInt(params.sim_card_id);
	const simCard = await findOrgSimCardByID(simCardId, locals.user.organization.id);

	if (!simCard) return error(404);

	const updateSimCardForm = await superValidate(zod(updateSimCardSchema));

	return { simCard, updateSimCardForm };
};

export const actions = {
	updateSimCard: async ({ request, locals, params }) => {
		if (!locals.user) return error(400);

		const simCardId = parseInt(params.sim_card_id);

		const { data } = await validateFormWithFailOnError(request, updateSimCardSchema);

		await updateOrgSimCard(simCardId, locals.user.organization.id, data);

		// TODO: test me !

		// const { password } = userWithPassword;
		// const oldPasswordIsValid = compareSync(form.data.oldPassword, password);
		// if (!oldPasswordIsValid) return setError(form, 'oldPassword', 'invalid password');
		// const newPasswordHash = hashSync(form.data.newPassword);
		// await updateUserPassword(locals.user.id, newPasswordHash);
		// return message(form, { text: 'password updated', type: 'success' });
	}
};
