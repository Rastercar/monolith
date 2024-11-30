import { userSchema, userSessionSchema } from '$lib/api/user.schema.js';
import { SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import { INVALID_SESSION } from '$lib/constants/error-codes';
import { route } from '$lib/ROUTES';
import type { LoggedInPageMeta } from '$lib/routes-meta';
import { db } from '$lib/server/db/db';
import { wrapToArray } from '$lib/utils/arrays';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
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

	// somehow the user got a invalid session cookie so delete it
	if (!sessionFromDb) {
		event.cookies.delete(SESSION_ID_COOKIE_KEY, { path: '/' });
		redirect(302, route('/auth/sign-out'));
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

/**
 * checks if there is a user on the request and he has all the required permissions to access a page
 *
 * @param evt - the request
 *
 * @param meta - meta of the page the user is trying to access
 */
export function verifyUserCanAccessAuthenticatedRoute(evt: RequestEvent, meta: LoggedInPageMeta) {
	const { user } = evt.locals;

	if (!user) {
		return redirect(303, route('/auth/sign-in', { redirect: evt.url.pathname }));
	}

	if (meta.requiredPermissions) {
		const requiredPerms = wrapToArray(meta.requiredPermissions);
		const hasPerms = requiredPerms.every((p) => user.accessLevel.permissions.includes(p));

		if (!hasPerms) return error(400, 'missing permissions');
	}
}

/**
 * Overide of the App.Locals for when we know the user has been authenticated
 */
type AuthedLocals = Omit<App.Locals, 'user'> & { user: User };

type ReqParams = RequestEvent['params'];
type ReqRouteId = RequestEvent['route']['id'];

/**
 * Basically the same as SvelteKit RequestEvent but the locals are
 *
 * different as we know the request has been previously authenticated
 */
type AuthedRequestEvent<T extends ReqParams, U extends ReqRouteId> = Omit<
	RequestEvent<T, U>,
	'locals'
> & { locals: AuthedLocals };

/**
 * Same as SvelteKit RequestHandler but for already authenticated Requests
 */
type AuthedRequestHandler<Params extends ReqParams, RouteId extends ReqRouteId> = (
	event: AuthedRequestEvent<Params, RouteId>
) => Response | Promise<Response>;

/**
 * Wraps a request handler and calls it after verifying
 * the request has been previously authenticated, augmenting request.locals
 *
 * usefull for +server.ts files endpoints as unlike pages they are not protected
 *
 * @param handler - the authenticated request handler
 */
export function withAuth<T extends ReqParams, U extends ReqRouteId>(
	handler: AuthedRequestHandler<T, U>
): RequestHandler<T, U> {
	const inner: RequestHandler<T, U> = (req) => {
		if (!req.locals.user) error(403);
		return handler(req as AuthedRequestEvent<T, U>);
	};

	return inner;
}
