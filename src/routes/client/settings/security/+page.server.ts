import { changePasswordSchema } from '$lib/api/user';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const form = await superValidate(changePasswordSchema);
	return { form };
};
