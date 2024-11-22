import { getRouteMetaFromPath, redirectToStartingPage } from '$lib/routes-meta';
import { authenticateUserFromSessionCookieAndSetRequestLocals } from '$lib/server/middlewares';
import { error, type Handle } from '@sveltejs/kit';
import { bootstrapApplication } from './bootstrap';

bootstrapApplication();

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
	const routeMeta = getRouteMetaFromPath(path);

	if (path === '/') return redirectToStartingPage(event);

	if (!routeMeta) {
		// if we cant find the page metadata, we cannot decide if the user should be
		// allowed to view it so even though it exists treat it as if it does not
		return error(404, { message: 'Page not found' });
	}

	event.locals.routeMeta = routeMeta;

	if (routeMeta.requiredAuth === 'logged-in') {
		await authenticateUserFromSessionCookieAndSetRequestLocals(event);
	}

	const isLoggedIn = !!event.locals.user?.id;

	if (routeMeta.requiredAuth === 'logged-off' && isLoggedIn) {
		return redirectToStartingPage(event);
	}

	return resolve(event);
};
