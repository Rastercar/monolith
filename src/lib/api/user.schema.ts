import { passwordValidator, usernameValidator } from '$lib/utils/zod-validators';
import { z } from 'zod';
import { organizationSchema } from './organization.schema';

export const accessLevelSchema = z.object({
	id: z.number(),
	createdAt: z.string(),
	name: z.string(),
	description: z.string(),
	isFixed: z.boolean(),
	permissions: z.array(z.string())
});

export const userSchema = z.object({
	id: z.number(),
	createdAt: z.string().datetime(),
	username: z.string(),
	email: z.string().email(),
	emailVerified: z.boolean(),
	profilePicture: z.string().nullable(),
	description: z.string().nullable(),
	accessLevel: accessLevelSchema,
	organization: organizationSchema
});

export const updateUserSchema = z.object({
	email: z.string().email().optional(),
	username: usernameValidator.optional(),
	description: z.string().optional().nullable()
});

export const changePasswordSchema = z
	.object({
		oldPassword: z.string().min(5),
		newPassword: passwordValidator,
		newPasswordConfirmation: z.string()
	})
	.refine((data) => data.newPassword === data.newPasswordConfirmation, {
		message: "Passwords didn't match",
		path: ['passwordConfirmation']
	});

export const userSessionSchema = z.object({
	ip: z.string(),
	publicId: z.number().positive(),
	createdAt: z.string().datetime(),
	expiresAt: z.string().datetime(),
	userAgent: z.string(),
	sameAsFromRequest: z.boolean()
});

export type User = z.infer<typeof userSchema>;

export type UserSession = z.infer<typeof userSessionSchema>;

export type UpdateUserBody = z.infer<typeof updateUserSchema>;

export type ChangePasswordBody = z.infer<typeof changePasswordSchema>;
