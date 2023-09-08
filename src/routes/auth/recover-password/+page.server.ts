import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

// TODO: remove default test user before going to prod
const schema = z.object({
	email: z.string().email().default('rastercar.tests.002@gmail.com')
});

export const load: PageServerLoad = async () => {
	const form = await superValidate(schema);
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, schema);

		if (!form.valid) return fail(400, { form });

		const { email } = form.data;

		// TODO:
		console.log(email);

		return { form, success: true };
	}
};
