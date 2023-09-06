import { z } from 'zod';
import { isApiErrorObject, rastercarApi, redirectOnSessionError } from './common';

const userSchema = z.object({
	id: z.number(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime().nullable(),
	username: z.string(),
	email: z.string().email(),
	emailVerified: z.boolean(),
	profilePicture: z.string().nullable(),
	description: z.string(),
	organizationId: z.number().nullable(),
	accessLevelId: z.number()
});

const signInResponseSchema = z.object({ user: userSchema });

export type User = z.infer<typeof userSchema>;

type SignInResponse = z.infer<typeof signInResponseSchema>;

interface Credentials {
	email: string;
	password: string;
}

type SignRequestResponse = SignInResponse | 'not_found' | 'invalid_password';

export const apiSignIn = async (credentials: Credentials): Promise<SignRequestResponse> => {
	const response = await rastercarApi
		.post(credentials, '/auth/sign-in')
		.notFound((err) => {
			if (isApiErrorObject(err.json)) return 'not_found';
			throw err;
		})
		.unauthorized((err) => {
			if (isApiErrorObject(err.json)) return 'invalid_password';
			throw err;
		})
		.json<SignRequestResponse>();

	if (typeof response === 'string') return response;

	signInResponseSchema.parse(response);

	return response;
};

export const apiGetCurrentUser = async (): Promise<User> =>
	rastercarApi.get('/auth/me').json<User>().catch(redirectOnSessionError).then(userSchema.parse);

/**
 * signs out the current rastercar user session, this endpoint makes the user respond
 * with a expired session id cookie so the current session cookie is replaced by the expired one.
 *
 * on the next request to the api the browser deletes the cookie as its expired.
 */
export const apiSignOut = async (): Promise<void> => {
	await rastercarApi.post({}, '/auth/sign-out').text();
};
