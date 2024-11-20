import {
	signInUpResponseSchema,
	type RecoverPasswordByTokenDto,
	type SignInUpResponse,
	type SignUpDto
} from './auth.schema';
import {
	fallthroughApiErrorMessage,
	rastercarApi,
	returnErrorCodeOnApiError,
	returnErrorStringOrParsedSchemaObj
} from './utils';

/**
 * Signs up to rastercar, creating a new organization, user and root access level
 * for the new org, on success a session cookie will be set and the user will be
 * authenticated for subsequent requests
 */
export const apiSignUp = (body: SignUpDto): Promise<SignInUpResponse | string> =>
	rastercarApi
		.post(body, '/auth/sign-up')
		.badRequest(fallthroughApiErrorMessage)
		// since we caught a possible badRequestError and returned its error message above
		// the response type might be SignInUpResponse | string
		.json<SignInUpResponse | string>()
		.then((res) => returnErrorStringOrParsedSchemaObj(res, signInUpResponseSchema));

/**
 * requests a password recovery email to be sent to the email address if a user exists with said email
 */
export const apiRequestRecoverPasswordEmail = (email: string): Promise<string> =>
	rastercarApi
		.post({ email }, '/auth/request-recover-password-email')
		.notFound(returnErrorCodeOnApiError('not_found'))
		.json<string>();

/**
 * changes the password of the user that owns / is contained in the recover password token
 */
export const apiRecoverPasswordByToken = (body: RecoverPasswordByTokenDto): Promise<string> =>
	rastercarApi.post(body, '/auth/change-password-by-recovery-token').json<string>();

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
