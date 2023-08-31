import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(1)
});

export const load: PageServerLoad = async () => {
	const form = await superValidate(schema);
	return { form };
};
