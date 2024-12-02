import { SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import { deleteSessionByPublicId, findSessionByPublicId } from '$lib/server/db/repo/session';
import { withAuth } from '$lib/server/middlewares/auth';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import type { RouteParams } from './$types';

export const DELETE: RequestHandler<RouteParams> = withAuth(async ({ locals, params, cookies }) => {
	const sessionPublicId = parseInt(params.session_id);

	const sessionToDelete = await findSessionByPublicId(sessionPublicId);

	if (!sessionToDelete) {
		return error(400, { message: 'session not found' });
	}

	if (sessionToDelete.userId !== locals.user.id) {
		return error(403, { message: 'session does not belong to the request user' });
	}

	await deleteSessionByPublicId(sessionPublicId);

	// if the session we deleted on the database then log out the user by removing the cookie
	if (sessionPublicId === locals.session.publicId) {
		cookies.delete(SESSION_ID_COOKIE_KEY, { path: '/' });
	}

	return json('session deleted');
});
