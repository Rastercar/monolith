import { SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = ({ cookies }) => {
	cookies.delete(SESSION_ID_COOKIE_KEY, { path: '/' });
	return new Response('session deleted successfully');
};
