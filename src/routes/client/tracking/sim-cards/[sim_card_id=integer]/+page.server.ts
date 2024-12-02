import { updateSimCardSchema } from '$lib/api/sim-card.schema';
import { findSimCardByID } from '$lib/server/db/repo/sim-card.js';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params }) => {
	const simCardId = parseInt(params.sim_card_id);
	const simCard = await findSimCardByID(simCardId);

	// TODO: resource not found error page
	if (!simCard) return error(404);

	const updateSimCardForm = await superValidate(zod(updateSimCardSchema));

	return { simCard, updateSimCardForm };
};

// export const actions = {
// 	updateSimCard: async ({ request, locals }) => {
// 		// TODO:
// 		// if (!locals.user) return error(400);
// 		// const form = await validateFormWithFailOnError(request, changePasswordSchema);
// 		// const userWithPassword = await findUserById(locals.user.id);
// 		// if (!userWithPassword) return error(500);
// 		// const { password } = userWithPassword;
// 		// const oldPasswordIsValid = compareSync(form.data.oldPassword, password);
// 		// if (!oldPasswordIsValid) return setError(form, 'oldPassword', 'invalid password');
// 		// const newPasswordHash = hashSync(form.data.newPassword);
// 		// await updateUserPassword(locals.user.id, newPasswordHash);
// 		// return message(form, { text: 'password updated', type: 'success' });
// 	}
// };
