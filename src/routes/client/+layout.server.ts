import { INVALID_SESSION } from '$lib/constants/error-codes';
import { error } from '@sveltejs/kit';

const defaultRouteMeta: Partial<RouteMeta> = {
	headerVisibility: true,
	sidebarVisibility: true
};

export async function load({ locals }) {
	// this should never happen as the /client is protected on hooks.server.ts
	if (!locals.user) {
		error(400, { message: 'You must be logged in to see this page', code: INVALID_SESSION });
	}

	const routeMeta: RouteMeta = { ...locals.routeMeta, ...defaultRouteMeta };

	return { user: locals.user, routeMeta };
}
