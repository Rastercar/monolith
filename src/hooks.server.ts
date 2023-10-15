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

const protectedRoutes = ['/client'];

const redirectRoutes: Record<string, string> = { '/client/settings': '/client/settings/profile' };

export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;

	const routeMeta = routesMeta[path] ?? {};

	const sessionId = event.cookies.get(SESSION_ID_COOKIE_KEY);
	const isLoggedIn = !!sessionId;

	const startingPointPage = isLoggedIn ? '/client' : '/auth/sign-in';

	event.locals.sessionId = sessionId;

	let requiredAuth = routeMeta.requiredAuth;

	if (protectedRoutes.some((route) => path.startsWith(route)) && !requiredAuth) {
		requiredAuth = 'logged-in';
	}

	const routeToRedirect = redirectRoutes[path];

	if (path === '/') {
		throw redirect(303, startingPointPage);
	}

	if (routeToRedirect) {
		throw redirect(303, routeToRedirect);
	}

	if (requiredAuth === 'logged-in' && !isLoggedIn) {
		throw redirect(303, `/auth/sign-in?redirect=${path}`);
	}

	if (requiredAuth === 'logged-off' && isLoggedIn && path !== '/') {
		throw redirect(303, startingPointPage);
	}

	return resolve(event);
};
