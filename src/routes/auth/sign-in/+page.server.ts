import { signInSchema } from '$lib/api/auth.schema';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const form = await superValidate(signInSchema);
	return { form };
};
