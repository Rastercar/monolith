import { SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import { redirect, type Handle } from '@sveltejs/kit';

interface RouteMeta {
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

const protectedPaths = ['/client'];

const redirectRoutes: Record<string, string> = { '/client/settings': '/client/settings/profile' };

// TODO:
//
// here i would like to redirect the user if he does not have the permissions, however
// the request does not contain the user, only the user session id cookie, i could in theory
// call the api every time and check the permissions, but a adittional api call seems shit
// also this is also triggered every time sveltekit recieves a request, such as on a form submission
// so this would lead to useless api calls (eg: the user loaded a page, had the permissions and submited a form, checking the permissions
// for the route hes already in for no reason)
//
// TODO: document here that this is fired on every request and thus should not contain compute heavy or blocking code ?
//
// and also avoid traps, for now we fell into one such as redirecting on a http request if the user submited a form after
// clearing his cookies
//
// ideally this should be as empty as possible
//
// see: https://github.com/sveltejs/kit/issues/552
//
// one thing we can do is subscribe to the page store, on the root layout and have a permissiom map there (maybe even share the one used by this hook ?)
//
// so if the page changes to one that requires a permission on the root layout subscription checks the user has it and if not redirects to a errror page
//
// see: https://github.com/sveltejs/kit/issues/552#issuecomment-671707880
//
// MAYBE USE THIS INSTEAD OF SUBSCRIBING TO THE PAGE STORE ?
//
// https://kit.svelte.dev/docs/modules#$app-navigation-beforenavigate
export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;

	const routeMeta = routesMeta[path] ?? {};

	const sessionId = event.cookies.get(SESSION_ID_COOKIE_KEY);

	const isLoggedIn = !!sessionId;

	const routeIsInProtectedPath = protectedPaths.some((p) => path.startsWith(p));

	const requiredAuth = routeIsInProtectedPath ? 'logged-in' : routeMeta.requiredAuth;

	const routeToRedirect = redirectRoutes[path];

	const startingPointPage = isLoggedIn ? '/client' : '/auth/sign-in';

	if (path === '/') {
		throw redirect(303, startingPointPage);
	}

	if (routeToRedirect) {
		throw redirect(303, routeToRedirect);
	}

	if (requiredAuth === 'logged-in' && !isLoggedIn) {
		throw redirect(303, `/auth/sign-in?redirect=${path}`);
	}

	if (requiredAuth === 'logged-off' && isLoggedIn) {
		throw redirect(303, startingPointPage);
	}

	return resolve(event);
};
