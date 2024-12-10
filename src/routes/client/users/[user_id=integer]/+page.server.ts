import { simpleUserSchema } from '$lib/api/user.schema.js';
import { findOrgUserById } from '$lib/server/db/repo/user.js';
import { acl } from '$lib/server/middlewares/auth.js';

export const load = async ({ params, locals }) => {
	const { user: requestUser } = acl(locals);

	const userId = parseInt(params.user_id);

	const dbUser = await findOrgUserById(userId, requestUser.organization.id);

	const user = simpleUserSchema.parse(dbUser);

	return { user };
};
