import { building } from '$app/environment';
import { route } from '$lib/ROUTES';
import {
	getRouteMetaFromPath as getPageMetaFromPath,
	redirectToStartingPage
} from '$lib/routes-meta';
import { initCronJobs } from '$lib/server/cronjobs';
import { initDb } from '$lib/server/db/db';
import {
	denyAccessOnMissingPermissions,
	setUserLocalsFromSessionCookie
} from '$lib/server/middlewares/auth';
import { initRabbitMq } from '$lib/server/rabbitmq/rabbitmq';
import { ensureSocketIoServerIsConfigured } from '$lib/server/socketio';
import { redirect, type Handle } from '@sveltejs/kit';

// if this modules is not being loaded during a build, then
// we should initialize the application dependencies
if (!building) {
	initDb();
	initRabbitMq();
	initCronJobs();
}

// server hook:
//
// this is run on every request sveltekit receives, be it a page load, form submission
// or api route call, for this reason.
//
// This should be as slim as possible and not contain any compute heavy or blocking code
// such as a HTTP request.
export const handle: Handle = async ({ event, resolve }) => {
	ensureSocketIoServerIsConfigured();

	const path = event.url.pathname;
	const pageMeta = getPageMetaFromPath(path);

	if (path === '/') return redirectToStartingPage(event);
	await setUserLocalsFromSessionCookie(event);

	const isLoggedIn = !!event.locals.user;

	// if the request is a request for the HTML of a page and that page has associated metadata
	const isLoadingPageWithMeta = !!pageMeta && event.request.method === 'GET';

	// if we are loading a page and it requires the user to be logged in
	if (isLoadingPageWithMeta && pageMeta?.requiredAuth === 'logged-in') {
		// deny access if the user is not logged in
		if (!event.locals.user) {
			return redirect(303, route('/auth/sign-in', { redirect: event.url.pathname }));
		}

		// deny access if the user does not have the required permissions
		if (pageMeta.requiredPermissions) {
			denyAccessOnMissingPermissions(event.locals.user, pageMeta.requiredPermissions);
		}

		// redirect to the change password page if the user must change his password before accessing the app
		if (
			event.locals.user.mustSetNewPassword &&
			event.url.pathname !== '/client/settings/security'
		) {
			const changePasswordRoute = route('/client/settings/security', {
				redirectHereDueToForcePasswordChange: 'true'
			});

			return redirect(303, changePasswordRoute);
		}
	}

	if (pageMeta?.requiredAuth === 'logged-off' && isLoggedIn) {
		return redirectToStartingPage(event);
	}

	return resolve(event);
};
