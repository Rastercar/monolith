import { blockOrgUserById, findOrgUserById } from '$lib/server/db/repo/user';
import { acl } from '$lib/server/middlewares/auth';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals }) => {
	const { user: reqUser } = acl(locals, { requiredPermissions: 'BLOCK_USER' });

	const userToBeBlockedId = parseInt(params.user_id);

	const user = await findOrgUserById(userToBeBlockedId, reqUser.organization.id);
	if (!user) error(404, 'user to block not found');

	await blockOrgUserById(userToBeBlockedId, reqUser.organization.id);

	return json('user blocked');
};
