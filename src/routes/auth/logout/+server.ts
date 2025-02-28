import { SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import { deleteSessionByToken } from '$lib/server/db/repo/session';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
	const sessionId = cookies.get(SESSION_ID_COOKIE_KEY);
	cookies.delete(SESSION_ID_COOKIE_KEY, { path: '/' });

	if (sessionId) await deleteSessionByToken(sessionId);
	return new Response('sessão removida');
};
