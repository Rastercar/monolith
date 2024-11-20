import { userSchema } from '$lib/api/user.schema.js';
import { SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import { INVALID_SESSION, NO_SID_COOKIE } from '$lib/constants/error-codes';
import { db } from '$lib/server/db/db';
import { error } from '@sveltejs/kit';

export async function load({ cookies }) {
	const sessionId = cookies.get(SESSION_ID_COOKIE_KEY);

	if (!sessionId) {
		return error(400, { message: 'You must be logged in to see this page', code: NO_SID_COOKIE });
	}

	const session = await db.query.session.findFirst({
		where: (session, { eq }) => eq(session.sessionToken, sessionId)
	});

	if (!session) {
		return error(400, { message: 'Invalid user session', code: INVALID_SESSION });
	}

	const userFromDb = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, session.userId),
		with: { organization: true, accessLevel: true }
	});

	if (!userFromDb) {
		return error(400, { message: 'Internal server error while fetching your user' });
	}

	// this also remove sensitive data such as the password and other tokens
	const user = userSchema.parse(userFromDb);

	return { user };
}
