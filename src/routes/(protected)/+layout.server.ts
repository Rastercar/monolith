import type { LayoutServerLoad } from './$types';

// TODO: here we should return the user data instead of the session id
export const load: LayoutServerLoad = async ({ locals }) => {
	return { sessionId: locals.sessionId };
};
