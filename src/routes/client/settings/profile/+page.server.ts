import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const schema = z.object({
	email: z.string().email(),
	username: z.string(),
	description: z.string()
});

export const load: PageServerLoad = async () => {
	const form = await superValidate(schema);
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, schema);

		console.log('!!', form.valid, form.errors, form.data);

		if (!form.valid) return fail(400, { form });

		// TODO: call api and update user
		return { form, error: 'TODO!' };
	}
};
