import { route } from '$lib/ROUTES';
import { redirect } from '@sveltejs/kit';

export function load() {
	// there is no sense in having a /settings page, since its unclear what it should be
	// (user settings, org settings ?) so redirect to the profile settings
	return redirect(303, route('/client/settings/profile'));
}
