import { SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import { redirect, type Handle } from '@sveltejs/kit';

interface RouteMeta {
	/**
	 * the required authentication status for the route
	 *
	 * this is ignored if the route starts with a protected path
	 */
	requiredAuth?: 'logged-in' | 'logged-off';
}

// [BLOCKER]
//
// it would be nice to have a list of possible api endpoints generated according
// to the sveltekit file system routing, because this is very error prone and does
// not work well with routes with slugs, (eg: foo/[id]/bar)
//
// see: https://github.com/sveltejs/kit/issues/647
const routesMeta: Record<string, RouteMeta> = {
	'/auth/sign-in': { requiredAuth: 'logged-off' },
	'/auth/sign-up': { requiredAuth: 'logged-off' },
	'/auth/sign-out': { requiredAuth: 'logged-in' }
};

/**
 * paths where every route that starts with said path are only accessible to authenticated users
 */
const protectedPaths = ['/client'];

// server hook:
//
// this is run on every request sveltekit receives, be it a page load, form submission
// or api route call, for this reason.
//
// This should be as slim as possible and not contain any compute heavy or blocking code
// such as a HTTP request.
//
// See the project readme `Good to know` section for more info
export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;

	const routeMeta = routesMeta[path] ?? {};

	const sessionId = event.cookies.get(SESSION_ID_COOKIE_KEY);

	const isLoggedIn = !!sessionId;

	const routeIsInProtectedPath = protectedPaths.some((p) => path.startsWith(p));

	const requiredAuth = routeIsInProtectedPath ? 'logged-in' : routeMeta.requiredAuth;

	const startingPointPage = isLoggedIn ? '/client' : '/auth/sign-in';

	console.log({ isLoggedIn, path });

	if (path === '/') {
		console.log('redirecting, 1');
		return redirect(303, startingPointPage);
	}

	if (requiredAuth === 'logged-in' && !isLoggedIn) {
		console.log('redirecting, 2');
		return redirect(303, `/auth/sign-in?redirect=${path}`);
	}

	if (requiredAuth === 'logged-off' && isLoggedIn) {
		console.log('redirecting, 3');
		return redirect(303, startingPointPage);
	}

	console.log('going to:', path);
	return resolve(event);
};
