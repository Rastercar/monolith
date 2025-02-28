import { route } from '$lib/ROUTES';
import { redirect } from '@sveltejs/kit';

export function load() {
	// there is no sense in having a /configuracoes page, since its unclear what it should be
	// (user settings, org settings ?) so redirect to the profile settings
	return redirect(303, route('/client/configuracoes/perfil'));
}
