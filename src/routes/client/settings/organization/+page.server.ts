import { updateOrganizationSchema } from '$lib/api/organization';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const form = await superValidate(updateOrganizationSchema);
	return { form };
};
