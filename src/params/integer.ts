import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string) => {
	const n = parseInt(param);
	return !Number.isNaN(n) && n > 0;
}) satisfies ParamMatcher;
