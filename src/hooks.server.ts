import { SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import { NO_PAGE_METADATA } from '$lib/constants/error_codes';
import { redirect, type Handle } from '@sveltejs/kit';

type route = '/' | '/auth/sign-in' | '/auth/sign-out' | '/error/internal' | '/client';

interface RouteMeta {
	requiredAuth?: 'logged-in' | 'logged-off';
}

const routesMeta: Record<route, RouteMeta> = {
	'/': {},
	'/auth/sign-in': { requiredAuth: 'logged-off' },
	'/auth/sign-out': { requiredAuth: 'logged-in' },
	'/error/internal': {},
	'/client': { requiredAuth: 'logged-in' }
};

export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname as route;

	const routeMeta = routesMeta[path];

	if (!routeMeta) throw redirect(303, `/error/internal?error_code=${NO_PAGE_METADATA}`);

	const sessionId = event.cookies.get(SESSION_ID_COOKIE_KEY);
	const isLoggedIn = !!sessionId;

	event.locals.sessionId = sessionId;

	if (routeMeta.requiredAuth === 'logged-in' && !isLoggedIn) {
		throw redirect(303, `/auth/sign-in?redirect=${path}`);
	}

	if (routeMeta.requiredAuth === 'logged-off' && isLoggedIn && path !== '/') {
		throw redirect(303, '/');
	}

	return resolve(event);
};
