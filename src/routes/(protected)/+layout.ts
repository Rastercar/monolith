import type { LayoutLoad } from './$types';

// TODO: here we should return the user data instead of the session id
export const load: LayoutLoad = async ({ data }) => {
	return { sessionId: data.sessionId };
};
