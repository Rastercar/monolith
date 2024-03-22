import { apiRequestRecoverPasswordEmail } from '$lib/api/auth';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

// [PROD-TODO] remove default test user
const schema = z.object({
	email: z.string().email().default('rastercar.tests.002@gmail.com')
});

export const load: PageServerLoad = async () => ({
	form: await superValidate(zod(schema))
});

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(schema));

		if (!form.valid) return fail(400, { form });

		const res = await apiRequestRecoverPasswordEmail(form.data.email);

		const error: null | 'not_found' = res === 'not_found' ? 'not_found' : null;

		return { form, error };
	}
};
