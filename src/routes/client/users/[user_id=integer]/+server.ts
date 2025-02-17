import { deleteOrgUserById, findOrgUserById } from '$lib/server/db/repo/user';
import { acl } from '$lib/server/middlewares/auth';
import { s3 } from '$lib/server/services/s3';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ locals, params, cookies }) => {
	const { user: reqUser, orgId } = acl(locals, { requiredPermissions: 'DELETE_USER' });

	const userToDeleteId = parseInt(params.user_id);

	if (reqUser.id === userToDeleteId) {
		return error(400, 'cannot delete your own user');
	}

	const userToDelete = await findOrgUserById({ id: userToDeleteId, orgId });
	if (!userToDelete) {
		return error(404);
	}

	if (!userToDelete.organization) {
		return error(500, 'failed to verify user to delete org');
	}

	if (userToDelete.organization.ownerId === userToDelete.id) {
		return error(403, 'cannot delete the owner of your organization');
	}

	if (userToDelete.profilePicture) {
		await s3.deleteFile(userToDelete.profilePicture);
	}

	await deleteOrgUserById({ id: userToDeleteId, orgId });

	return json('user deleted');
};
