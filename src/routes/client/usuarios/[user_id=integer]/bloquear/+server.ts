import { blockOrgUserById, findOrgUserById } from '$lib/server/db/repo/user';
import { acl } from '$lib/server/middlewares/auth';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals }) => {
	const { orgId } = acl(locals, { requiredPermissions: 'BLOCK_USER' });

	const userToBeBlockedId = parseInt(params.user_id);

	const user = await findOrgUserById({ id: userToBeBlockedId, orgId });
	if (!user) error(404, 'usuário a ser bloquado não encontrado');

	await blockOrgUserById({ id: userToBeBlockedId, orgId });

	return json('usuário bloqueado');
};
