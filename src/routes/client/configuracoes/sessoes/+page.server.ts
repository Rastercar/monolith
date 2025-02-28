import { userSessionSchema } from '$lib/api/user.schema';
import { findSessionsByUserId } from '$lib/server/db/repo/session';
import { acl } from '$lib/server/middlewares/auth';

export const load = async ({ locals }) => {
	const { user, session } = acl(locals);

	const sessionsFromDb = await findSessionsByUserId(user.id);

	const sessions = sessionsFromDb
		.map((s) => ({ ...s, sameAsFromRequest: s.publicId === session.publicId }))
		.map((s) => userSessionSchema.parse(s));

	return { sessions };
};
