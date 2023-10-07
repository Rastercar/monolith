import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../components/$types';

export const load: PageServerLoad = async ({ url }) => {
	const confirmEmailToken = url.searchParams.get('token');

	if (!confirmEmailToken) {
		throw error(500, { message: 'no confirm email token found' });
	}

	return { confirmEmailToken };
};
