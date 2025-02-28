import { updateUserAccessLevelSchema } from '$lib/api/user.schema';
import { findOrgAccessLevelById } from '$lib/server/db/repo/access-level';
import { setOrgUserAccessLevel } from '$lib/server/db/repo/user';
import { acl } from '$lib/server/middlewares/auth';
import { validateJsonRequestBody } from '$lib/server/middlewares/validation';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	const { orgId } = acl(locals, { requiredPermissions: 'MANAGE_USER_ACCESS_LEVELS' });

	const userId = parseInt(params.user_id);

	const { accessLevelId } = await validateJsonRequestBody(request, updateUserAccessLevelSchema);

	// assert access level belongs to request user org
	const accessLevel = await findOrgAccessLevelById({ id: accessLevelId, orgId });
	if (!accessLevel) return error(404, 'nível de acesso atualizado');

	await setOrgUserAccessLevel({ userId, orgId, accessLevelId });

	return json('nível de acesso alterado');
};
