import { changePasswordSchema } from '$lib/api/user.schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(changePasswordSchema));
	return { form };
};
