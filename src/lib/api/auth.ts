import { z } from 'zod';
import { apiJsonWithSchema, type RasterCarApiResponse } from './common';

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

const signInResponse = z.object({ user: userSchema });

type SignInResponse = z.infer<typeof signInResponse>;

interface Credentials {
	email: string;
	password: string;
}

export const apiSignIn = async (credentials: Credentials): RasterCarApiResponse<SignInResponse> =>
	apiJsonWithSchema(signInResponse, 'auth/sign-in', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(credentials)
	});
