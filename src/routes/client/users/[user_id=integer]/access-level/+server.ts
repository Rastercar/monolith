import { updateUserAccessLevelSchema } from '$lib/api/user.schema';
import { findOrgAccessLevelById } from '$lib/server/db/repo/access-level';
import { setOrgUserAccessLevel } from '$lib/server/db/repo/user';
import { acl } from '$lib/server/middlewares/auth';
import { validateJsonRequestBody } from '$lib/server/middlewares/validation';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	const { user: reqUser } = acl(locals, { requiredPermissions: 'MANAGE_USER_ACCESS_LEVELS' });

	const userId = parseInt(params.user_id);

	const { accessLevelId } = await validateJsonRequestBody(request, updateUserAccessLevelSchema);

	// assert access level belongs to request user org
	const accessLevel = await findOrgAccessLevelById({
		id: accessLevelId,
		orgId: reqUser.organization.id
	});
	if (!accessLevel) return error(404, 'access level does not exist');

	await setOrgUserAccessLevel({ userId, orgId: reqUser.organization.id, accessLevelId });

	return json('access level changed');
};
