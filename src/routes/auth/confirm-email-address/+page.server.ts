import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../components/$types';

export const load: PageServerLoad = async ({ url }) => {
	const confirmEmailToken = url.searchParams.get('token');

	/**
	 * if the confirm email token refers to a organization billing email confirmation token
	 * rather than a user email confirmation token
	 */
	const confirmingForOrg = url.searchParams.get('confirmingFor') === 'organization';

	if (!confirmEmailToken) {
		throw error(500, { message: 'no confirm email token found' });
	}

	return { confirmEmailToken, confirmingForOrg };
};
