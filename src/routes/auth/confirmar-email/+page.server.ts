import { error } from '@sveltejs/kit';

export const load = async ({ url }) => {
	const token = url.searchParams.get('token');

	/**
	 * if the confirm email token refers to a organization billing email confirmation token
	 * rather than a user email confirmation token
	 */
	const confirmingForOrg = url.searchParams.get('confirmingForOrg') === 'true';

	if (!token) {
		return error(500, { message: 'token de confirmação não encontrado' });
	}

	return { token, confirmingForOrg };
};
