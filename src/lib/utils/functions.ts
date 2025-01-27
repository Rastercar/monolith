/**
 * a empty function, this should be used to signify that
 * the code that calls this function wants nothing to happen,
 * this is commonly used as a callback to prevent the default
 * behavior of something
 *
 * @example
 * ```ts
 * // for example the intent here
 * onEvent({ event: '', calback: noOperation })
 *
 * // is much clearer than here
 * onEvent({ event: '', calback: () => {} })
 * ```
 */
export function noOperation() {}

/**
 * a empty function, this should be used to signify that
 * the code that calls this function wants nothing to happen,
 * this is commonly used as a callback to prevent the default
 * behavior of something
 *
 * @example
 * ```ts
 * // for example the intent here
 * onEvent({ event: '', calback: asyncNoOperation })
 *
 * // is much clearer than here
 * onEvent({ event: '', calback: asyncNoOperation })
 * ```
 */
export async function asyncNoOperation() {}
