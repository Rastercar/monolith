import { redirect, type Handle } from '@sveltejs/kit';

// TODO:
// return to a proper unauthorized error page
// return to login page
// find a way to know if i can fetch page metadata from handle

type route = '/' | '/auth/sign-in' | '/auth/sign-out' | '/error/internal';

interface RouteMeta {
	requiredAuth?: 'logged-in' | 'logged-off';
}

const routesMeta: Record<route, RouteMeta> = {
	'/': {},
	'/auth/sign-in': { requiredAuth: 'logged-off' },
	'/auth/sign-out': { requiredAuth: 'logged-in' },
	'/error/internal': {}
};

const SESSION_ID_COOKIE_KEY = 'sid';

const handleSignOut: Handle = ({ event }) => {
	event.cookies.delete(SESSION_ID_COOKIE_KEY, { path: '/' });
	throw redirect(303, '/auth/sign-in');
};

export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname as route;

	if (path === '/auth/sign-out') return handleSignOut({ event, resolve });

	const routeMeta = routesMeta[path];

	// TODO: set the original path as a query parameter (or get from history ?) so a better error message can be show
	// change me to a handle no meta fn
	if (!routeMeta) throw redirect(303, '/error/internal?error_code=no_meta');

	const sessionId = event.cookies.get(SESSION_ID_COOKIE_KEY);
	const isLoggedIn = !!sessionId;

	// TODO: how do i do this ? on client side after login ?
	// whats the difference between locals and client state ?
	if (sessionId) {
		event.locals.user = { id: 123 };
	}

	if (routeMeta.requiredAuth === 'logged-in' && !isLoggedIn) throw redirect(303, '/auth/sign-in');

	if (routeMeta.requiredAuth === 'logged-off' && isLoggedIn) {
		// TODO: check for infinite redirect
		throw redirect(303, '/');
	}

	// const query = event.url.searchParams.get('signout');

	// if (Boolean(query) == true) {
	// 	event.cookies.delete('session_id', { path: '/' });
	// }

	return resolve(event);
};
