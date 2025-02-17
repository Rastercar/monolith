import { findOrgUserById, unblockOrgUserById } from '$lib/server/db/repo/user';
import { acl } from '$lib/server/middlewares/auth';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals }) => {
	const { orgId } = acl(locals, { requiredPermissions: 'BLOCK_USER' });

	const userToBeUnblockedId = parseInt(params.user_id);

	const user = await findOrgUserById({ id: userToBeUnblockedId, orgId });
	if (!user) error(404, 'user to unblock not found');

	await unblockOrgUserById({ id: userToBeUnblockedId, orgId });

	return json('user unblocked');
};
