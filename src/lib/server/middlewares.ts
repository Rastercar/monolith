import { userSchema, userSessionSchema } from '$lib/api/user.schema.js';
import { SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import { INVALID_SESSION } from '$lib/constants/error-codes';
import { route } from '$lib/ROUTES';
import type { LoggedInRouteMeta } from '$lib/routes-meta';
import { db } from '$lib/server/db/db';
import { wrapToArray } from '$lib/utils/arrays';
import type { RequestEvent } from '@sveltejs/kit';
import { error, redirect } from '@sveltejs/kit';

/**
 * If there is a session cookie, authenticates and sets the locals
 * user and session, otherwise sets them to null
 *
 * if there is any errors during this a sveltekit error is called
 * so callers of this function need to worry about handling auth
 * errors themselves
 */
export async function setUserLocalsFromSessionCookie(event: RequestEvent) {
	const sessionToken = event.cookies.get(SESSION_ID_COOKIE_KEY);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return;
	}

	const sessionFromDb = await db.query.session.findFirst({
		with: { user: true },
		where: (session, { eq }) => eq(session.sessionToken, sessionToken)
	});

	if (!sessionFromDb) {
		return error(400, { message: 'Invalid user session', code: INVALID_SESSION });
	}

	const userFromDb = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, sessionFromDb.userId),
		with: { organization: true, accessLevel: true }
	});

	// session points to a invalid user
	if (!userFromDb) {
		return error(500, { message: 'Invalid session', code: INVALID_SESSION });
	}

	// this also remove sensitive data such as the password and other tokens
	event.locals.user = userSchema.parse(userFromDb);

	// this also remove sensitive data such as the token
	event.locals.session = userSessionSchema.parse({
		...sessionFromDb,
		sameAsFromRequest: true
	});
}

export function verifyUserCanAccessAuthenticatedRoute(
	event: RequestEvent,
	routeMeta: LoggedInRouteMeta
) {
	const { user } = event.locals;

	if (!user) {
		return redirect(303, route('/auth/sign-in', { redirect: event.url.pathname }));
	}

	if (routeMeta.requiredPermissions) {
		const requiredPerms = wrapToArray(routeMeta.requiredPermissions);
		const hasPerms = requiredPerms.every((p) => user.accessLevel.permissions.includes(p));

		if (!hasPerms) return error(400, 'missing permissions');
	}
}
