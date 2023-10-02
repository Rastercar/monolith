import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

// [PROD-TODO] remove default test user before going to prod
const schema = z.object({
	email: z.string().email().default('rastercar.tests.002@gmail.com'),
	password: z.string().min(1).default('testuser')
});

export const load: PageServerLoad = async () => {
	const form = await superValidate(schema);
	return { form };
};
