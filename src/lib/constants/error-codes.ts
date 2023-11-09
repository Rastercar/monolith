/**
 * a request to the rastercar api endpoint was unauthorized because if did not contain
 * the session id cookie
 */
export const NO_SID_COOKIE = 'NO_SID_COOKIE';

/**
 * a request to a endpoint was not authorized because the session on the session id
 * cookie is expired or does not exist
 */
export const INVALID_SESSION = 'INVALID_SESSION';

/**
 * a user could not be created because the username is in use
 */
export const USERNAME_IN_USE = 'USERNAME_IN_USE';

/**
 * a email could not be used to create a entity because the email is in use
 */
export const EMAIL_IN_USE = 'EMAIL_IN_USE';

/**
 * a vehicle could not be created / updated because the plate is in use
 */
export const PLATE_IN_USE = 'PLATE_IN_USE';
