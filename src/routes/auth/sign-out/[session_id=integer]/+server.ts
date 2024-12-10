import { SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import { deleteSessionByPublicId, findSessionByPublicId } from '$lib/server/db/repo/session';
import { acl } from '$lib/server/middlewares/auth';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import type { RouteParams } from './$types';

export const DELETE: RequestHandler<RouteParams> = async ({ locals, params, cookies }) => {
	const { user, session } = acl(locals);

	const sessionPublicId = parseInt(params.session_id);

	const sessionToDelete = await findSessionByPublicId(sessionPublicId);

	if (!sessionToDelete) {
		return error(400, { message: 'session not found' });
	}

	if (sessionToDelete.userId !== user.id) {
		return error(403, { message: 'session does not belong to the request user' });
	}

	await deleteSessionByPublicId(sessionPublicId);

	// if the session we deleted on the database then log out the user by removing the cookie
	if (sessionPublicId === session.publicId) {
		cookies.delete(SESSION_ID_COOKIE_KEY, { path: '/' });
	}

	return json('session deleted');
};
