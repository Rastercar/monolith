import { error } from '@sveltejs/kit';

/**
 * Asserts a svelte route slug is a valid int, throwing a sveltekit error response if not
 */
export function getIntParameterFromRouteSlug(
	slug: string,
	errMsg = 'invalid path parameter'
): number {
	const intParam = parseInt(slug);

	if (Number.isNaN(intParam)) error(404, errMsg);

	return intParam;
}
