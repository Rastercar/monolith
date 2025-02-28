import {
	countUsersUsingAccessLevel,
	deleteOrgAccessLevelById,
	findOrgAccessLevelById
} from '$lib/server/db/repo/access-level';
import { acl } from '$lib/server/middlewares/auth';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { user, orgId } = acl(locals, { requiredPermissions: 'MANAGE_USER_ACCESS_LEVELS' });

	const alId = parseInt(params.access_level_id);

	if (user.accessLevel.id === alId) {
		return error(403, 'não é possível deletar seu nível de acesso');
	}

	const accessLevelToDelete = await findOrgAccessLevelById({ id: alId, orgId });
	if (!accessLevelToDelete) return error(404);

	if (accessLevelToDelete.isFixed) {
		return error(403, 'não é possível deletar um nível de acesso fixo');
	}

	const userCount = await countUsersUsingAccessLevel(alId);

	if (userCount > 0) {
		return error(403, 'não é possível deletar um nível de acesso com usuários associados');
	}

	await deleteOrgAccessLevelById({ id: alId, orgId });

	return json('nível de acesso deletado');
};
