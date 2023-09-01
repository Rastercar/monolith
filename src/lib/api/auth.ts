import { z } from 'zod';
import { isApiErrorObject, rastercarApi } from './common';

const userSchema = z.object({
	id: z.number(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime().nullable(),
	username: z.string(),
	email: z.string().email(),
	emailVerified: z.boolean(),
	profilePicture: z.string().nullable(),
	description: z.string(),
	organizationId: z.number(),
	accessLevelId: z.number()
});

const signInResponseSchema = z.object({ user: userSchema });

type SignInResponse = z.infer<typeof signInResponseSchema>;

interface Credentials {
	email: string;
	password: string;
}

type SignRequestResponse = SignInResponse | 'not_found' | 'invalid_password';

export const apiSignIn = async (credentials: Credentials): Promise<SignRequestResponse> => {
	const response = await rastercarApi
		.options({ credentials: 'include' })
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
