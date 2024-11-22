import { redirect, type RequestEvent } from '@sveltejs/kit';
import { route, type KIT_ROUTES } from './ROUTES';

/**
 * - logged-in: the user MUST be logged in to access the route
 * - logged-off: the user MUST NOT be logged in to access the route
 * - any: the user can access the route regardless of being logged in
 */
export type RouteRequiredAuth = 'logged-in' | 'logged-off' | 'any';

export interface RouteMeta {
	/**
	 * the required authentication status for the route
	 *
	 * this is ignored if the route starts with a protected path
	 */
	requiredAuth?: RouteRequiredAuth;

	/**
	 * if the header of the client layout should be visible
	 */
	headerVisibility?: boolean;

	/**
	 * if the sidebar of the client layout should be visible
	 */
	sidebarVisibility?: boolean;
}

const routesMeta: Record<keyof KIT_ROUTES['PAGES'], RouteMeta> = {
	'/auth/sign-in': { requiredAuth: 'logged-off' },
	'/auth/sign-up': { requiredAuth: 'logged-off' },
	'/auth/sign-out': { requiredAuth: 'logged-in' },
	'/auth/change-password': { requiredAuth: 'any' },
	'/auth/confirm-email-address': { requiredAuth: 'any' },
	'/auth/recover-password': { requiredAuth: 'any' },
	'/client': { requiredAuth: 'logged-in' },
	'/client/access-levels': { requiredAuth: 'logged-in' },
	'/client/access-levels/[access_level_id]': { requiredAuth: 'logged-in' },
	'/client/access-levels/new': { requiredAuth: 'logged-in' },
	'/client/my-profile': { requiredAuth: 'logged-in' },
	'/client/settings/organization': { requiredAuth: 'logged-in' },
	'/client/settings/profile': { requiredAuth: 'logged-in' },
	'/client/settings/security': { requiredAuth: 'logged-in' },
	'/client/settings/sessions': { requiredAuth: 'logged-in' },
	'/client/tracking/map': { requiredAuth: 'logged-in' },
	'/client/tracking/quick-track': { requiredAuth: 'logged-in' },
	'/client/tracking/sim-cards': { requiredAuth: 'logged-in' },
	'/client/tracking/sim-cards/[sim_card_id]': { requiredAuth: 'logged-in' },
	'/client/tracking/sim-cards/new': { requiredAuth: 'logged-in' },
	'/client/tracking/trackers': { requiredAuth: 'logged-in' },
	'/client/tracking/trackers/[tracker_id]': { requiredAuth: 'logged-in' },
	'/client/tracking/trackers/new': { requiredAuth: 'logged-in' },
	'/client/tracking/vehicles': { requiredAuth: 'logged-in' },
	'/client/tracking/vehicles/[vehicle_id]': { requiredAuth: 'logged-in' },
	'/client/tracking/vehicles/new': { requiredAuth: 'logged-in' },
	'/client/users': { requiredAuth: 'logged-in' },
	'/client/users/[user_id]': { requiredAuth: 'logged-in' },
	'/client/users/new': { requiredAuth: 'logged-in' }
};

export function getRouteMetaFromPath(path: string): RouteMeta | undefined {
	return routesMeta[path as keyof typeof routesMeta];
}

/**
 * Redirects to the appropriate page according to user login status
 */
export async function redirectToStartingPage(event: RequestEvent) {
	const isLoggedIn = !!event.locals.user?.id;
	const startingPointPage = isLoggedIn ? route('/client') : route('/auth/sign-in');

	return redirect(303, startingPointPage);
}
