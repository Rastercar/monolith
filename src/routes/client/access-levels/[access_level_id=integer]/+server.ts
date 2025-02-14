import {
	countUsersUsingAccessLevel,
	deleteOrgAccessLevelById,
	findOrgAccessLevelById
} from '$lib/server/db/repo/access-level';
import { acl } from '$lib/server/middlewares/auth';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { user } = acl(locals, { requiredPermissions: 'MANAGE_USER_ACCESS_LEVELS' });

	const alId = parseInt(params.access_level_id);

	if (user.accessLevel.id === alId) {
		return error(403, 'cannot delete your own access level');
	}

	const accessLevelToDelete = await findOrgAccessLevelById({
		id: alId,
		orgId: user.organization.id
	});
	if (!accessLevelToDelete) return error(404);

	if (accessLevelToDelete.isFixed) {
		return error(403, 'cannot delete a fixed access level');
	}

	const userCount = await countUsersUsingAccessLevel(alId);

	if (userCount > 0) {
		return error(403, 'cannot delete access level with associated users');
	}

	await deleteOrgAccessLevelById({ id: alId, orgId: user.organization.id });

	return json('access level deleted');
};
