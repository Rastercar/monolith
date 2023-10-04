import { SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import { redirect, type Handle } from '@sveltejs/kit';

interface RouteMeta {
	requiredAuth?: 'logged-in' | 'logged-off';
}

const routesMeta: Record<string, RouteMeta> = {
	'/auth/sign-in': { requiredAuth: 'logged-off' },
	'/auth/sign-up': { requiredAuth: 'logged-off' },
	'/auth/sign-out': { requiredAuth: 'logged-in' },
	'/auth/recover-password': { requiredAuth: 'logged-off' }
};

export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;

	const routeMeta = routesMeta[path] ?? {};

	const sessionId = event.cookies.get(SESSION_ID_COOKIE_KEY);
	const isLoggedIn = !!sessionId;

	event.locals.sessionId = sessionId;

	let requiredAuth = routeMeta.requiredAuth;

	if (path.startsWith('/client') && !requiredAuth) {
		requiredAuth = 'logged-in';
	}

	if (requiredAuth === 'logged-in' && !isLoggedIn) {
		throw redirect(303, `/auth/sign-in?redirect=${path}`);
	}

	if (requiredAuth === 'logged-off' && isLoggedIn && path !== '/') {
		throw redirect(303, '/');
	}

	return resolve(event);
};
