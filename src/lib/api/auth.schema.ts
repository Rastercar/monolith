import { PUBLIC_IS_DEV } from '$env/static/public';
import { passwordValidator, usernameValidator } from '$lib/utils/zod-validators';
import { z } from 'zod';
import { userSchema } from './user.schema';

export const signUpSchema = z
	.object({
		email: z.string().email(),
		username: usernameValidator,
		password: passwordValidator,
		passwordConfirmation: z.string().min(5)
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: "Passwords didn't match",
		path: ['passwordConfirmation']
	});

export const signInUpResponseSchema = z.object({ user: userSchema });

export const recoverPasswordByTokenSchema = z
	.object({
		newPassword: passwordValidator,
		passwordConfirmation: z.string().min(5)
	})
	.refine((data) => data.newPassword === data.passwordConfirmation, {
		message: "Passwords didn't match",
		path: ['passwordConfirmation']
	});

export const signInSchema = z.object({
	email: z
		.string()
		.min(1)
		.email()
		.default(PUBLIC_IS_DEV === 'true' ? 'rastercar.tests.002@gmail.com' : ''),
	password: z
		.string()
		.min(1)
		.default(PUBLIC_IS_DEV === 'true' ? 'testuser' : '')
});

export const recoverPasswordSchema = z.object({
	email: z
		.string()
		.email()
		.default(PUBLIC_IS_DEV === 'true' ? 'rastercar.tests.002@gmail.com' : '')
});

export type SignInDto = z.infer<typeof signInSchema>;

export type SignInUpResponse = z.infer<typeof signInUpResponseSchema>;

export type SignUpDto = Omit<z.infer<typeof signUpSchema>, 'passwordConfirmation'>;

export type RecoverPasswordByTokenDto = Omit<
	z.infer<typeof recoverPasswordByTokenSchema>,
	'passwordConfirmation'
> & { passwordResetToken: string };
