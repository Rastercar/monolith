import { redirect, type RequestEvent } from '@sveltejs/kit';
import { route, type KIT_ROUTES } from './ROUTES';
import type { permission } from './constants/permissions';

/**
 * - logged-in: the user MUST be logged in to access the route
 * - logged-off: the user MUST NOT be logged in to access the route
 * - any: the user can access the route regardless of being logged in
 */
export type PageMeta = LoggedInPageMeta | NonLoggedInPageMeta;

interface NonLoggedInPageMeta {
	requiredAuth: 'logged-off' | 'any';
}

export interface LoggedInPageMeta {
	requiredAuth: 'logged-in';

	/**
	 * the user required permissions to access the route
	 */
	requiredPermissions?: permission | permission[];

	/**
	 * if the layout header should be visible
	 */
	headerVisibility?: boolean;

	/**
	 * if the layout sidebar be visible
	 */
	sidebarVisibility?: boolean;
}

const reqPerms = (requiredPermissions?: permission | permission[]): PageMeta => ({
	requiredAuth: 'logged-in',
	requiredPermissions
});

/**
 * metadata of every page on the application
 *
 * important: this only refers to routes generated from +page.svelte
 * files, API endpoints and form actions are not considered here
 */
export const routesMeta: Record<keyof KIT_ROUTES['PAGES'], PageMeta> = {
	'/auth/sign-in': { requiredAuth: 'logged-off' },
	'/auth/sign-up': { requiredAuth: 'logged-off' },
	'/auth/change-password': { requiredAuth: 'any' },
	'/auth/recover-password': { requiredAuth: 'any' },
	'/auth/confirm-email-address': { requiredAuth: 'any' },
	'/auth/sign-out': reqPerms(),
	'/client': reqPerms(),
	'/client/access-levels': reqPerms('MANAGE_USER_ACCESS_LEVELS'),
	'/client/access-levels/[access_level_id=integer]': reqPerms('MANAGE_USER_ACCESS_LEVELS'),
	'/client/access-levels/new': reqPerms('MANAGE_USER_ACCESS_LEVELS'),
	'/client/my-profile': reqPerms(),
	'/client/settings/organization': reqPerms('UPDATE_ORGANIZATION'),
	'/client/settings/profile': reqPerms(),
	'/client/settings/security': reqPerms(),
	'/client/settings/sessions': reqPerms(),
	'/client/tracking/map': { headerVisibility: false, requiredAuth: 'logged-in' },
	'/client/tracking/sim-cards': reqPerms(),
	'/client/tracking/sim-cards/[sim_card_id=integer]': reqPerms(),
	'/client/tracking/sim-cards/new': reqPerms('CREATE_SIM_CARD'),
	'/client/tracking/trackers': reqPerms(),
	'/client/tracking/trackers/[tracker_id=integer]': reqPerms(),
	'/client/tracking/trackers/new': reqPerms('CREATE_TRACKER'),
	'/client/tracking/vehicles': reqPerms(),
	'/client/tracking/vehicles/[vehicle_id=integer]': reqPerms(),
	'/client/tracking/vehicles/new': reqPerms('CREATE_VEHICLE'),
	'/client/tracking/fleets': reqPerms(),
	'/client/tracking/fleets/[fleet_id=integer]': reqPerms(),
	'/client/tracking/fleets/new': reqPerms('CREATE_FLEET'),
	'/client/users': reqPerms(),
	'/client/users/[user_id=integer]': reqPerms(),
	'/client/users/new': reqPerms('CREATE_USER')
};

export function getRouteMetaFromPath(path: string): PageMeta | undefined {
	return routesMeta[path as keyof typeof routesMeta];
}

/**
 * Redirects to the appropriate page according to user login status
 */
export function redirectToStartingPage(event: RequestEvent) {
	const isLoggedIn = !!event.locals.user;
	return redirect(303, isLoggedIn ? route('/client') : route('/auth/sign-in'));
}
