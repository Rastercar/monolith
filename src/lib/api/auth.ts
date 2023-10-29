import { z } from 'zod';
import {
	signInUpResponseSchema,
	type RecoverPasswordByTokenDto,
	type SignInDto,
	type SignInUpResponse,
	type SignUpDto
} from './auth.schema';
import { userSessionSchema, type UserSession } from './user.schema';
import {
	fallthroughApiErrorMessage,
	rastercarApi,
	returnErrorCodeOnApiError,
	returnErrorStringOrParsedSchemaObj
} from './utils';

type SignRequestResponse = SignInUpResponse | 'not_found' | 'invalid_password';

/**
 * Signs in to the rastercar API with email and password, on success a session
 * cookie will be set and the user will be authenticated for subsequent requests
 */
export const apiSignIn = async (credentials: SignInDto): Promise<SignRequestResponse> => {
	const response = await rastercarApi
		.post(credentials, '/auth/sign-in')
		.notFound(returnErrorCodeOnApiError('not_found'))
		.unauthorized(returnErrorCodeOnApiError('invalid_password'))
		.json<SignRequestResponse>();

	if (typeof response === 'string') return response;

	signInUpResponseSchema.parse(response);
	return response;
};

/**
 * Signs up to rastercar, creating a new organization, user and root access level
 * for the new org, on success a session cookie will be set and the user will be
 * authenticated for subsequent requests
 */
export const apiSignUp = async (body: SignUpDto): Promise<SignInUpResponse | string> =>
	rastercarApi
		.post(body, '/auth/sign-up')
		.badRequest(fallthroughApiErrorMessage)
		// since we caught a possible badRequestError and returned its error message above
		// the response type might be SignInUpResponse | string
		.json<SignInUpResponse | string>()
		.then((res) => returnErrorStringOrParsedSchemaObj(res, signInUpResponseSchema));

/**
 * signs out the current rastercar user session, this endpoint makes the user respond
 * with a expired session id cookie so the current session cookie is replaced by the expired one.
 *
 * on the next request to the api the browser deletes the cookie as its expired.
 */
export const apiSignOut = async (): Promise<void> => {
	await rastercarApi.post({}, '/auth/sign-out').text();
};

/**
 * requests a password recovery email to be sent to the email address if a user exists with said email
 */
export const apiRequestRecoverPasswordEmail = async (email: string): Promise<string> =>
	rastercarApi
		.post({ email }, '/auth/request-recover-password-email')
		.notFound(returnErrorCodeOnApiError('not_found'))
		.json<string>();

/**
 * changes the password of the user that owns / is contained in the recover password token
 */
export const apiRecoverPasswordByToken = async (body: RecoverPasswordByTokenDto): Promise<string> =>
	rastercarApi.post(body, '/auth/change-password-by-recovery-token').json<string>();

/**
 * list all sessions that belong to the currently logged in user
 */
export const apiGetUserSessions = async (): Promise<UserSession[]> =>
	rastercarApi.get('/auth/sessions').json<UserSession[]>().then(z.array(userSessionSchema).parse);

/**
 * Deletes (signs out) of a user session by its public id
 */
export const apiDeleteSession = async (sessionPublicId: number): Promise<string> =>
	rastercarApi.delete(`/auth/sign-out/${sessionPublicId}`).text();

/**
 * confirms the email address of a user that owns the email address confirmation token
 *
 * this token is obtained on the a link sent to the user email address, meaning it can
 * only be retrieved by someone with access to said email address
 */
export const apiConfirmUserEmailAddressByToken = async (token: string): Promise<string> =>
	rastercarApi.post({ token }, '/auth/confirm-email-address-by-token').json<string>();
