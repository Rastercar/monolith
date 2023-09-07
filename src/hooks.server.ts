import { SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import { redirect, type Handle } from '@sveltejs/kit';

type route =
	| '/'
	| '/auth/sign-in'
	| '/auth/sign-up'
	| '/auth/sign-out'
	| '/auth/recover-password'
	| '/client';

interface RouteMeta {
	requiredAuth?: 'logged-in' | 'logged-off';
}

const routesMeta: Record<route, RouteMeta> = {
	'/': {},
	'/auth/sign-in': { requiredAuth: 'logged-off' },
	'/auth/sign-up': { requiredAuth: 'logged-off' },
	'/auth/sign-out': { requiredAuth: 'logged-in' },
	'/auth/recover-password': { requiredAuth: 'logged-off' },
	'/client': { requiredAuth: 'logged-in' }
};

const defaultRouteMeta = {};

export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname as route;

	const routeMeta = routesMeta[path] ?? defaultRouteMeta;

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
