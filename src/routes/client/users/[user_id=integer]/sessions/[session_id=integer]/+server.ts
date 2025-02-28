import { deleteSessionByPublicId } from '$lib/server/db/repo/session';
import { findOrgUserById } from '$lib/server/db/repo/user';
import { acl } from '$lib/server/middlewares/auth';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const { orgId } = acl(locals, { requiredPermissions: 'LOGOFF_USER' });

	const userIdOfSessionToBeDeleted = parseInt(params.user_id);
	const sessionToBeDeletedPublicId = parseInt(params.session_id);

	// assert the user belongs to the request user org
	const sessionOwner = await findOrgUserById({ id: userIdOfSessionToBeDeleted, orgId });
	if (!sessionOwner) return error(404);

	await deleteSessionByPublicId(sessionToBeDeletedPublicId);

	return json('sessão deletada');
};
