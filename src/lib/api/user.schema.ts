import { passwordValidator, usernameValidator } from '$lib/utils/zod-validators';
import { z } from 'zod';
import { accessLevelSchema } from './access-level.schema';
import { organizationSchema } from './organization.schema';

export const getUsersSearchParamsSchema = z.object({
	email: z.string().optional()
});

export const userSchema = z.object({
	id: z.number(),
	createdAt: z.date({ coerce: true }),
	username: z.string(),
	email: z.string().email(),
	emailVerified: z.boolean(),
	profilePicture: z.string().nullable(),
	description: z.string().nullable(),
	accessLevel: accessLevelSchema,
	organization: organizationSchema
});

export const createUserSchema = z
	.object({
		email: z.string().email(),
		username: usernameValidator,
		description: z.string().optional().nullable(),
		accessLevelId: z.number().gt(0),
		password: passwordValidator,
		passwordConfirmation: z.string().min(5)
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: "Passwords didn't match",
		path: ['passwordConfirmation']
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
		path: ['newPasswordConfirmation']
	});

export const userSessionSchema = z.object({
	ip: z.string(),
	publicId: z.number().positive(),
	createdAt: z.date({ coerce: true }),
	expiresAt: z.date({ coerce: true }),
	userAgent: z.string(),

	/**
	 * If this session fetched from the API is the
	 * same session used to authenticate the request itself.
	 *
	 * eg: whenever fetching your own list of sessions, one of
	 * the sessions in the list will have this property as true.
	 *
	 * if fetching a list of sessions of another user, this will
	 * always be false.
	 */
	sameAsFromRequest: z.boolean()
});

export const simpleUserSchema = z.object({
	id: z.number(),
	createdAt: z.date({ coerce: true }),
	username: z.string(),
	email: z.string().email(),
	emailVerified: z.boolean(),
	profilePicture: z.string().nullable(),
	description: z.string().nullable()
});

/**
 * A rastercar user, unlike the `User` type this does not contain
 * the user accessLevel nor its organization
 */
export type SimpleUser = z.infer<typeof simpleUserSchema>;

/**
 * A rastercar user with its access level and organization,
 * this type is commonly used to describe the currently logged in user
 */
export type User = z.infer<typeof userSchema>;

export type UserSession = z.infer<typeof userSessionSchema>;

export type GetUsersFilters = z.infer<typeof getUsersSearchParamsSchema>;

export type UpdateUserBody = z.infer<typeof updateUserSchema>;

export type ChangePasswordBody = z.infer<typeof changePasswordSchema>;

export type CreateUserBody = z.infer<typeof createUserSchema>;
