import { redirect } from '@sveltejs/kit';

export function load() {
	// there is no sense in having a /settings page, since its unclear what it should be
	// (user settings, org settings ?) so redirect to the profile settings
	redirect(303, '/client/settings/profile');
}
