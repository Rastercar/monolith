import { findOrgUserById, unblockOrgUserById } from '$lib/server/db/repo/user';
import { acl } from '$lib/server/middlewares/auth';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals }) => {
	const { user: reqUser } = acl(locals, { requiredPermissions: 'BLOCK_USER' });

	const userToBeUnblockedId = parseInt(params.user_id);

	const user = await findOrgUserById(userToBeUnblockedId, reqUser.organization.id);
	if (!user) error(404, 'user to unblock not found');

	await unblockOrgUserById(userToBeUnblockedId, reqUser.organization.id);

	return json('user unblocked');
};
