import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from '../components/$types';

const schema = z.object({
	passwordConfirmation: z.string().min(5),
	newPassword: z.string().min(5).max(128)
});

export const load: PageServerLoad = async ({ url }) => {
	const form = await superValidate(schema);
	const passwordRecoveryToken = url.searchParams.get('token');

	if (!passwordRecoveryToken) {
		throw error(500, { message: 'no password recovery token found' });
	}

	return { form, passwordRecoveryToken };
};
