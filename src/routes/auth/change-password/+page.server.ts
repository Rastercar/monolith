import { recoverPasswordByTokenSchema } from '$lib/api/auth.schema';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from '../components/$types';

export const load: PageServerLoad = async ({ url }) => {
	const form = await superValidate(recoverPasswordByTokenSchema);
	const passwordRecoveryToken = url.searchParams.get('token');

	if (!passwordRecoveryToken) {
		error(500, { message: 'no password recovery token found' });
	}

	return { form, passwordRecoveryToken };
};
