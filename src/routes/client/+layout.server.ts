import { INVALID_SESSION } from '$lib/constants/error-codes';
import { error } from '@sveltejs/kit';

export async function load({ locals, url }) {
	// when loading the client layout, we expect the locals.user to be set on hooks.user.ts
	// if that has not been set a route /client has its meta wrongfully set to 'logged-off' or 'any'.
	if (!locals.user) {
		console.warn(
			`[ERROR] route ${url.pathname}, meta "requiredAuth" should be set to "logged-in", found: ${locals.routeMeta?.requiredAuth ?? 'undefined'}`
		);
		return error(400, { message: 'You must be logged in to see this page', code: INVALID_SESSION });
	}

	return { user: locals.user };
}
