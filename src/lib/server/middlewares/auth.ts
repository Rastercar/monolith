import { userSchema, userSessionSchema } from '$lib/api/user.schema';
import { SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import { MISSING_SESSION } from '$lib/constants/error-codes';
import type { permission } from '$lib/constants/permissions';
import { route } from '$lib/ROUTES';
import { wrapToArray } from '$lib/utils/arrays';
import type { RequestEvent } from '@sveltejs/kit';
import { error, redirect } from '@sveltejs/kit';
import { findSessionByToken } from '../db/repo/session';
import { findUserByIdWithOrgAndAccessLevel } from '../db/repo/user';

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

	const sessionFromDb = await findSessionByToken(sessionToken);

	// somehow the user got a invalid session cookie so delete it
	if (!sessionFromDb) {
		event.cookies.delete(SESSION_ID_COOKIE_KEY, { path: '/' });
		return redirect(302, route('/auth/logout'));
	}

	const userFromDb = await findUserByIdWithOrgAndAccessLevel(sessionFromDb.userId);

	// session points to a invalid user
	if (!userFromDb) {
		return error(500, { message: 'invalid session', code: MISSING_SESSION });
	}

	// this also remove sensitive data such as the password and other tokens
	event.locals.user = userSchema.parse(userFromDb);

	// this also remove sensitive data such as the token
	event.locals.session = userSessionSchema.parse({
		...sessionFromDb,
		sameAsFromRequest: true
	});
}

export function denyAccessOnMissingPermissions(user: User, reqPerms: permission | permission[]) {
	if (!checkUSerHasPermissions(user, reqPerms)) return error(401, 'missing permissions');
}

export function checkUSerHasPermissions(user: User, reqPerms: permission | permission[]): boolean {
	return wrapToArray(reqPerms).every((p) => user.accessLevel?.permissions?.includes(p));
}

interface AclOptions {
	requiredPermissions?: permission | permission[];
}

interface AclRes {
	user: User;

	/**
	 * organization ID of the user, shorthand to avoid typing `user.organization.id` everytime
	 */
	orgId: number;

	session: UserSession;
}

export function acl({ user, session }: App.Locals, options?: AclOptions): AclRes {
	const { requiredPermissions } = options ?? {};

	if (!session || !user) return error(403);

	if (requiredPermissions) denyAccessOnMissingPermissions(user, requiredPermissions);

	return { user, orgId: user.organization.id, session };
}
