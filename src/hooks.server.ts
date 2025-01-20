import { building } from '$app/environment';
import {
	getRouteMetaFromPath as getPageMetaFromPath,
	redirectToStartingPage
} from '$lib/routes-meta';
import { initCronJobs } from '$lib/server/cronjobs';
import { initDb } from '$lib/server/db/db';
import {
	setUserLocalsFromSessionCookie,
	verifyUserCanAccessAuthenticatedRoute
} from '$lib/server/middlewares/auth';
import { initRabbitMq } from '$lib/server/rabbitmq/rabbitmq';
import { ensureSocketIoServerIsConfigured } from '$lib/server/socketio';
import { initTelemetry } from '$lib/server/telemetry/opentelemetry';
import { type Handle } from '@sveltejs/kit';

// if this modules is not being loaded during a build, then
// we should initialize the application dependencies
//
// important: initialize telemetry before anything else
if (!building) {
	initTelemetry();

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

	if (isLoadingPageWithMeta && pageMeta?.requiredAuth === 'logged-in') {
		verifyUserCanAccessAuthenticatedRoute(event, pageMeta);
	}

	if (pageMeta?.requiredAuth === 'logged-off' && isLoggedIn) {
		return redirectToStartingPage(event);
	}

	return resolve(event);
};
