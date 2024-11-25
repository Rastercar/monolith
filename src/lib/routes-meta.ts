import { redirect, type RequestEvent } from '@sveltejs/kit';
import { route, type KIT_ROUTES } from './ROUTES';
import type { apiPermission } from './constants/permissions';

/**
 * - logged-in: the user MUST be logged in to access the route
 * - logged-off: the user MUST NOT be logged in to access the route
 * - any: the user can access the route regardless of being logged in
 */
export type RouteMeta = LoggedInMeta | NonLoggedInMeta;

interface NonLoggedInMeta {
	requiredAuth: 'logged-off' | 'any';
}

interface LoggedInMeta {
	requiredAuth: 'logged-in';

	/**
	 * the user required permissions to access the route
	 */
	requiredPermissions?: apiPermission | apiPermission[];

	/**
	 * if the layout header should be visible
	 */
	headerVisibility?: boolean;

	/**
	 * if the layout sidebar be visible
	 */
	sidebarVisibility?: boolean;
}

/**
 * metadata of every route of the application
 */
export const routesMeta: Record<keyof KIT_ROUTES['PAGES'], RouteMeta> = {
	'/auth/sign-in': { requiredAuth: 'logged-off' },
	'/auth/sign-up': { requiredAuth: 'logged-off' },
	'/auth/sign-out': { requiredAuth: 'logged-in' },
	'/auth/change-password': { requiredAuth: 'any' },
	'/auth/confirm-email-address': { requiredAuth: 'any' },
	'/auth/recover-password': { requiredAuth: 'any' },

	// logged-in routes
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
