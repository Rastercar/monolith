import { signUpSchema } from '$lib/api/auth';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from '../components/$types';

export const load: PageServerLoad = async () => {
	const form = await superValidate(signUpSchema);
	return { form };
};
