import { SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	event.cookies.delete(SESSION_ID_COOKIE_KEY, { path: '/' });

	// TODO: send sign out request to the rastercar api
};
