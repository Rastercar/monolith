import { rastercarApi } from './utils';

/**
 * Deletes (signs out) of the current user session by its public id
 */
export const apiSignOutSpecificSession = (sessionPublicId: number): Promise<string> =>
	rastercarApi.delete(`/auth/sign-out/${sessionPublicId}`).text();

/**
 * Deletes a session by its public id, unlike the `/auth/sign-out/:sid` endpoint
 * this endpoint can be used to remove sessions owned by other users
 */
export const apiDeleteSession = (sessionPublicId: number): Promise<string> =>
	rastercarApi.delete(`/auth/session/${sessionPublicId}`).json<string>();

/**
 * confirms the email address of a user that owns the email address confirmation token
 *
 * this token is obtained on the a link sent to the user email address, meaning it can
 * only be retrieved by someone with access to said email address
 */
export const apiConfirmUserEmailAddressByToken = (token: string): Promise<string> =>
	rastercarApi.post({ token }, '/auth/confirm-email-address-by-token').json<string>();
