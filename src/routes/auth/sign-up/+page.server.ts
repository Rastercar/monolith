import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from '../components/$types';

const schema = z.object({
	email: z.string().email(),
	username: z.string().min(5),
	password: z.string().min(5),
	passwordConfirmation: z.string().min(5)
});

export const load: PageServerLoad = async () => {
	const form = await superValidate(schema);
	return { form };
};
