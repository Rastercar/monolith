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
	'/auth/login': { requiredAuth: 'logged-off' },
	'/auth/cadastro': { requiredAuth: 'logged-off' },
	'/auth/alterar-senha': { requiredAuth: 'any' },
	'/auth/recuperar-senha': { requiredAuth: 'any' },
	'/auth/confirmar-email': { requiredAuth: 'any' },
	'/auth/logout': reqPerms(),
	'/client': reqPerms(),
	'/client/niveis-acesso': reqPerms('MANAGE_USER_ACCESS_LEVELS'),
	'/client/niveis-acesso/[access_level_id=integer]': reqPerms('MANAGE_USER_ACCESS_LEVELS'),
	'/client/niveis-acesso/novo': reqPerms('MANAGE_USER_ACCESS_LEVELS'),
	'/client/meu-perfil': reqPerms(),
	'/client/configuracoes/organizacao': reqPerms('UPDATE_ORGANIZATION'),
	'/client/configuracoes/perfil': reqPerms(),
	'/client/configuracoes/seguranca': reqPerms(),
	'/client/configuracoes/sessoes': reqPerms(),
	'/client/rastreamento/mapa': { headerVisibility: false, requiredAuth: 'logged-in' },
	'/client/rastreamento/cartoes-sim': reqPerms(),
	'/client/rastreamento/cartoes-sim/[sim_card_id=integer]': reqPerms(),
	'/client/rastreamento/cartoes-sim/novo': reqPerms('CREATE_SIM_CARD'),
	'/client/rastreamento/rastreadores': reqPerms(),
	'/client/rastreamento/rastreadores/[tracker_id=integer]': reqPerms(),
	'/client/rastreamento/rastreadores/novo': reqPerms('CREATE_TRACKER'),
	'/client/rastreamento/veiculos': reqPerms(),
	'/client/rastreamento/veiculos/[vehicle_id=integer]': reqPerms(),
	'/client/rastreamento/veiculos/novo': reqPerms('CREATE_VEHICLE'),
	'/client/rastreamento/frotas': reqPerms(),
	'/client/rastreamento/frotas/[fleet_id=integer]': reqPerms(),
	'/client/rastreamento/frotas/novo': reqPerms('CREATE_FLEET'),
	'/client/usuarios': reqPerms(),
	'/client/usuarios/[user_id=integer]': reqPerms(),
	'/client/usuarios/novo': reqPerms('CREATE_USER')
};

export function getRouteMetaFromPath(path: string): PageMeta | undefined {
	return routesMeta[path as keyof typeof routesMeta];
}

/**
 * Redirects to the appropriate page according to user login status
 */
export function redirectToStartingPage(event: RequestEvent) {
	const isLoggedIn = !!event.locals.user;
	return redirect(303, isLoggedIn ? route('/client') : route('/auth/login'));
}
