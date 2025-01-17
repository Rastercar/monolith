import { dev } from '$app/environment';
import { passwordValidator, usernameValidator } from '$lib/utils/zod-validators';
import { z } from 'zod';

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

export const recoverPasswordByTokenSchema = z
	.object({
		token: z.string().uuid(),
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
		.default(dev ? 'rastercar.tests.002@gmail.com' : ''),
	password: z
		.string()
		.min(1)
		.default(dev ? 'Contafake3!' : '')
});

export const recoverPasswordSchema = z.object({
	email: z
		.string()
		.email()
		.default(dev ? 'rastercar.tests.002@gmail.com' : '')
});

export const confirmEmailAddressSchema = z.object({
	token: z.string().uuid(),
	confirmingForOrg: z.boolean().default(false)
});

export type ConfirmEmailAddressBody = z.infer<typeof confirmEmailAddressSchema>;

export const requestEmailConfirmationSchema = z.object({
	confirmingForOrg: z.boolean().default(false)
});

export type RequestEmailConfirmationBody = z.infer<typeof requestEmailConfirmationSchema>;
