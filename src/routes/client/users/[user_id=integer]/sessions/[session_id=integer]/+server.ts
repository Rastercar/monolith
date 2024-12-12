import { deleteSessionByPublicId } from '$lib/server/db/repo/session';
import { findOrgUserById } from '$lib/server/db/repo/user';
import { acl } from '$lib/server/middlewares/auth';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import type { RouteParams } from './$types';

export const DELETE: RequestHandler<RouteParams> = async ({ locals, params, cookies }) => {
	const { user: reqUser } = acl(locals, { requiredPermissions: 'LOGOFF_USER' });

	const userIdOfSessionToBeDeleted = parseInt(params.user_id);
	const sessionToBeDeletedPublicId = parseInt(params.session_id);

	if (reqUser.id === sessionToBeDeletedPublicId) {
		return error(400, 'cannot delete your own user');
	}

	// assert the user belongs to the request user org
	const sessionOwner = await findOrgUserById(userIdOfSessionToBeDeleted, reqUser.organization.id);
	if (!sessionOwner) return error(404);

	await deleteSessionByPublicId(sessionToBeDeletedPublicId);

	return json('session deleted');
};
