import { route } from '$lib/ROUTES';
import type { ConfirmEmailAddressBody, RequestEmailConfirmationBody } from './auth.schema';
import { api } from './utils';

/**
 * Deletes (signs out) of the current user session by its public id
 */
export const apiSignOutSpecificSession = (publicId: number): Promise<string> =>
	api
		.delete(
			route('DELETE /auth/sign-out/[session_id=integer]', { session_id: publicId.toString() })
		)
		.text();

/**
 * TODO: remove if unused
 *
 * Deletes a session by its public id, unlike the `/auth/sign-out/:sid` endpoint
 * this endpoint can be used to remove sessions owned by other users
 */
export const apiDeleteSession = (sessionPublicId: number): Promise<string> =>
	api.delete(`/auth/session/${sessionPublicId}`).json<string>();

/**
 * confirms the email address of a user or org that owns the email address confirmation token
 *
 * this token is obtained on the a link sent to the user email address, meaning it can
 * only be retrieved by someone with access to said email address
 */
export const apiConfirmEmailAddress = (body: ConfirmEmailAddressBody): Promise<string> =>
	api.post(body, route('POST /auth/confirm-email-address')).json();

/**
 * Request a email to confirm a email address of a user or organization to be sent
 */
export const apiRequestEmailAddressConfirmation = (
	body: RequestEmailConfirmationBody
): Promise<string> => api.post(body, route('POST /auth/request-email-confirmation')).json();
