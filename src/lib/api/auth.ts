import { z } from 'zod';
import {
	fallthroughApiErrorMessage,
	rastercarApi,
	redirectOnSessionError,
	returnErrorCodeOnApiError,
	returnErrorStringOrParsedSchemaObj
} from './common';

export const accessLevelSchema = z.object({
	id: z.number(),
	createdAt: z.string(),
	updatedAt: z.null(),
	name: z.string(),
	description: z.string(),
	isFixed: z.boolean(),
	permissions: z.array(z.string())
});

export const organizationSchema = z.object({
	id: z.number(),
	createdAt: z.string(),
	updatedAt: z.string().nullable(),
	name: z.string(),
	billingEmail: z.string(),
	blocked: z.boolean(),
	billingEmailVerified: z.boolean()
});

const userSchema = z.object({
	id: z.number(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime().nullable(),
	username: z.string(),
	email: z.string().email(),
	emailVerified: z.boolean(),
	profilePicture: z.string().nullable(),
	description: z.string().nullable(),
	accessLevel: accessLevelSchema,
	organization: organizationSchema
});

const signInUpResponseSchema = z.object({ user: userSchema });

export type User = z.infer<typeof userSchema>;

export type Organization = z.infer<typeof organizationSchema>;

export type AccessLevel = z.infer<typeof accessLevelSchema>;

type SignInUpResponse = z.infer<typeof signInUpResponseSchema>;

export interface SignInDto {
	email: string;
	password: string;
}

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

export interface SignUpDto {
	email: string;
	username: string;
	password: string;
}

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
 * gets the current user within the session id on the session ID cookie
 */
export const apiGetCurrentUser = async (): Promise<User> =>
	rastercarApi.get('/auth/me').json<User>().catch(redirectOnSessionError).then(userSchema.parse);

/**
 * requests a password recovery email to be sent to the email address if a user exists with said email
 */
export const apiRequestRecoverPasswordEmail = async (email: string): Promise<string> =>
	rastercarApi
		.post({ email }, '/auth/request-recover-password-email')
		.notFound(returnErrorCodeOnApiError('not_found'))
		.json<string>();

/**
 * requests a email address confirmation email to be sent to the email address if a user exists with said email
 */
export const apiRequestEmailAddressConfirmationEmail = async (email: string): Promise<string> =>
	rastercarApi.post({ email }, '/auth/request-email-address-confirmation').json<string>();

interface RecoverPasswordByTokenDto {
	newPassword: string;
	passwordResetToken: string;
}

/**
 * changes the password of the user that owns / is contained in the recover password token
 */
export const apiRecoverPasswordByToken = async (body: RecoverPasswordByTokenDto): Promise<string> =>
	rastercarApi.post(body, '/auth/change-password-by-recovery-token').json<string>();

/**
 * confirms the email address of a user that owns the token (which was previously sent on a confirm address email)
 */
export const apiConfirmEmailAddressByToken = async (token: string): Promise<string> =>
	rastercarApi.post({ token }, '/auth/confirm-email-address-by-token').json<string>();
