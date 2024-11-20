// TODO: check all that are used !

/**
 * a request failed because the user lacks the required permissions
 */
export const MISSING_PERMISSIONS = 'MISSING_PERMISSIONS';

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

/**
 * a tracker could not be created / updated because the imei is in use
 */
export const IMEI_IN_USE = 'IMEI_IN_USE';

/**
 * a sim card could not be created / updated because the ssn is in use
 */
export const SSN_IN_USE = 'SSN_IN_USE';

/**
 * a sim card could not be created / updated because the phone number is in use
 */
export const PHONE_NUMBER_IN_USE = 'PHONE_NUMBER_IN_USE';
