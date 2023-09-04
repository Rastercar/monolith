/**
 * the route the user navigated to exists, however the lazy developer forgot to set its
 * metadata, therefore we can not know if the user should be allowed on this route.
 */
export const NO_PAGE_METADATA = 'no_meta';

/**
 * a request to the rastercar api endpoint was unauthorized because if did not contain
 * the session id cookie
 */
export const NO_SID_COOKIE = 'NO_SID_COOKIE';

/**
 * a request to a endpoint was not authorized because the session on the session id cookie
 * is expired or does not exist
 */
export const INVALID_SESSION = 'INVALID_SESSION';
