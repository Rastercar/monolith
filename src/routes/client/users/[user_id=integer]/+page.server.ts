import { simpleUserSchema, userSessionSchema } from '$lib/api/user.schema';
import { findSessionsByUserId } from '$lib/server/db/repo/session';
import { findOrgUserById } from '$lib/server/db/repo/user';
import { acl, checkUSerHasPermissions } from '$lib/server/middlewares/auth';
import { error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	const { user: requestUser, session: reqUserSession } = acl(locals);

	const userId = parseInt(params.user_id);

	const dbUser = await findOrgUserById({ id: userId, orgId: requestUser.organization.id });
	if (!dbUser) return error(404);

	let sessions: UserSession[] = [];

	if (checkUSerHasPermissions(requestUser, 'LIST_USER_SESSIONS')) {
		const dbSessions = await findSessionsByUserId(userId);
		sessions = dbSessions.map((m) =>
			userSessionSchema.parse({ ...m, sameAsFromRequest: reqUserSession.publicId === m.publicId })
		);
	}

	const user = simpleUserSchema.parse(dbUser);

	return { user, sessions };
};
