import { INVALID_SESSION } from '$lib/constants/error-codes';
import { error } from '@sveltejs/kit';

export async function load({ locals, url }) {
	if (!locals.user) {
		return error(400, { message: 'You must be logged in to see this page', code: INVALID_SESSION });
	}

	return { user: locals.user };
}
