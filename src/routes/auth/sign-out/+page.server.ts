import { apiSignOut } from '$lib/api/auth';
import { SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	event.cookies.delete(SESSION_ID_COOKIE_KEY, { path: '/' });
	await apiSignOut();
};
