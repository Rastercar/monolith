import { error } from '@sveltejs/kit';

/**
 * Asserts a svelte route slug is a valid int, throwing a sveltekit error response if not
 */
export const getIntParameterFromRouteSlug = (
	slug: string,
	errMsg = 'invalid path parameter'
): number => {
	const intParam = parseInt(slug);

	if (Number.isNaN(intParam)) error(404, errMsg);

	return intParam;
};

/**
 * A noop function, this should be used as a placeholder to remind
 * devs to NOT delete seemingly useless +page.server.ts files as those
 * files make sure the `hook.server.ts` file is called an the auth middleware
 * is executed.
 *
 * for more info see the main readme and or https://github.com/sveltejs/kit/issues/6315
 *
 * ```ts
 * // both are equivalent, but `runAuthMidleware` makes the intent clear
 * export const load: PageServerLoad = runAuthMidleware;
 * export const load: PageServerLoad = async () => ({});
 * ```
 */
export const runAuthMidleware = async () => ({});
