import { deleteOrgUserById, findOrgUserById } from '$lib/server/db/repo/user';
import { acl } from '$lib/server/middlewares/auth';
import { s3 } from '$lib/server/services/s3';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const { user: reqUser, orgId } = acl(locals, { requiredPermissions: 'DELETE_USER' });

	const userToDeleteId = parseInt(params.user_id);

	if (reqUser.id === userToDeleteId) {
		return error(400, 'não pode deletar seu próprio usuário');
	}

	const userToDelete = await findOrgUserById({ id: userToDeleteId, orgId });
	if (!userToDelete) {
		return error(404);
	}

	if (!userToDelete.organization) {
		return error(500, 'erro ao verificar organização de usuário a deletar');
	}

	if (userToDelete.organization.ownerId === userToDelete.id) {
		return error(403, 'não pode deletar o dono de sua organização');
	}

	if (userToDelete.profilePicture) {
		await s3.deleteFile(userToDelete.profilePicture);
	}

	await deleteOrgUserById({ id: userToDeleteId, orgId });

	return json('usuário deletado');
};
