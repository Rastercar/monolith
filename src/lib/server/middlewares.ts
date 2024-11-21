import { userSchema, userSessionSchema } from '$lib/api/user.schema.js';
import { SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import { INVALID_SESSION } from '$lib/constants/error-codes';
import { route } from '$lib/ROUTES';
import { db } from '$lib/server/db/db';
import type { RequestEvent } from '@sveltejs/kit';
import { error, redirect } from '@sveltejs/kit';

/**
 * Authenticates the user by his session cookies and sets
 * the `user` and `session` event locals, if the session cookie
 * is not present redirects to the login page
 *
 * if there is any errors during this a sveltekit error is called
 * so callers of this function need to worry about handling auth
 * errors themselves
 */
export async function authenticateUserFromSessionCookieAndSetRequestLocals(event: RequestEvent) {
	const sessionToken = event.cookies.get(SESSION_ID_COOKIE_KEY);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;

		return redirect(303, route('/auth/sign-in', { redirect: event.url.pathname }));
	}

	const sessionFromDb = await db.query.session.findFirst({
		where: (session, { eq }) => eq(session.sessionToken, sessionToken)
	});

	if (!sessionFromDb) {
		return error(400, { message: 'Invalid user session', code: INVALID_SESSION });
	}

	const userFromDb = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, sessionFromDb.userId),
		with: { organization: true, accessLevel: true }
	});

	if (!userFromDb) {
		return error(400, { message: 'Internal server error while fetching your user' });
	}

	// this also remove sensitive data such as the password and other tokens
	event.locals.user = userSchema.parse(userFromDb);

	// this also remove sensitive data such as the token
	event.locals.session = userSessionSchema.parse({
		...sessionFromDb,
		sameAsFromRequest: true
	});
}
