import { getRouteMetaFromPath, redirectToStartingPage } from '$lib/routes-meta';
import {
	setUserLocalsFromSessionCookie,
	verifyUserCanAccessAuthenticatedRoute
} from '$lib/server/middlewares';
import { initTelemetry } from '$lib/server/telemetry/opentelemetry';
import { error, type Handle } from '@sveltejs/kit';
import { bootstrapApplication } from './bootstrap';

// important: initialize telemetry before anything else
initTelemetry();
bootstrapApplication();

// server hook:
//
// this is run on every request sveltekit receives, be it a page load, form submission
// or api route call, for this reason.
//
// This should be as slim as possible and not contain any compute heavy or blocking code
// such as a HTTP request.
export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;
	const routeMeta = getRouteMetaFromPath(path);

	if (path === '/') return redirectToStartingPage(event);

	// if we cant find the page metadata, we cannot decide if the user should be
	// allowed to view it so even though it exists treat it as if it does not
	if (!routeMeta) {
		return error(404, { message: 'Page not found' });
	}

	event.locals.routeMeta = routeMeta;
	await setUserLocalsFromSessionCookie(event);

	const isLoggedIn = !!event.locals.user;

	if (routeMeta.requiredAuth === 'logged-in') {
		verifyUserCanAccessAuthenticatedRoute(event, routeMeta);
	}

	if (routeMeta.requiredAuth === 'logged-off' && isLoggedIn) {
		return redirectToStartingPage(event);
	}

	return resolve(event);
};
