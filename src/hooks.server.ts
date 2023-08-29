import { NO_PAGE_METADATA } from '$lib/constants/error_codes';
import { redirect, type Handle } from '@sveltejs/kit';

type route = '/' | '/auth/sign-in' | '/auth/sign-out' | '/error/internal' | '/admin' | '/client';

interface RouteMeta {
	requiredAuth?: 'logged-in' | 'logged-off';
}

const routesMeta: Record<route, RouteMeta> = {
	'/': {},
	'/auth/sign-in': { requiredAuth: 'logged-off' },
	'/auth/sign-out': { requiredAuth: 'logged-in' },
	'/error/internal': {},
	'/admin': { requiredAuth: 'logged-in' },
	'/client': { requiredAuth: 'logged-in' }
};

const SESSION_ID_COOKIE_KEY = 'sid';

const handleSignOut: Handle = ({ event }) => {
	event.cookies.delete(SESSION_ID_COOKIE_KEY, { path: '/' });
	throw redirect(303, '/auth/sign-in');
};

export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname as route;
	console.log('hooks.server.ts', path);

	if (path === '/auth/sign-out') return handleSignOut({ event, resolve });

	const routeMeta = routesMeta[path];

	if (!routeMeta) throw redirect(303, `/error/internal?error_code=${NO_PAGE_METADATA}`);

	const sessionId = event.cookies.get(SESSION_ID_COOKIE_KEY);
	const isLoggedIn = !!sessionId;

	event.locals.sessionId = sessionId;

	// TODO: here we could set the user by getting it from the rastercar API, eg
	// event.locals.user = apiGetUser()

	if (routeMeta.requiredAuth === 'logged-in' && !isLoggedIn) {
		throw redirect(303, `/auth/sign-in?to=${path}`);
	}

	if (routeMeta.requiredAuth === 'logged-off' && isLoggedIn && path !== '/') {
		throw redirect(303, '/');
	}

	return resolve(event);
};
