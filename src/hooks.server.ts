import { redirect, type Handle } from '@sveltejs/kit';

// TODO:

const unProtectedRoutes = ['/', '/auth/sign-in', '/auth/sign-up'];

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session_id');

	console.log({ sessionId });

	if (!sessionId && !unProtectedRoutes.includes(event.url.pathname)) {
		throw redirect(303, '/');
	}

	if (sessionId) {
		event.locals.user = { id: 123 };
	} else {
		if (!unProtectedRoutes.includes(event.url.pathname)) throw redirect(303, '/');
	}

	const query = event.url.searchParams.get('signout');
	if (Boolean(query) == true) {
		event.cookies.delete('session_id', { path: '/' });
	}

	return resolve(event);
};
