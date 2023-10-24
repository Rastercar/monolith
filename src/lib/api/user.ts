import { passwordValidator, usernameValidator } from '$lib/utils/zod-validators';
import { z } from 'zod';
import { userSchema, type User } from './auth';
import { rastercarApi, redirectOnSessionError } from './common';

/**
 * gets the current user within the session id on the session ID cookie
 */
export const apiGetCurrentUser = async (): Promise<User> =>
	rastercarApi.get('/user/me').json<User>().catch(redirectOnSessionError).then(userSchema.parse);

export const updateUserBodySchema = z.object({
	email: z.string().email().optional(),
	username: usernameValidator.optional(),
	description: z.string().optional().nullable()
});

export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;

/**
 * updates and returns the updated current user
 */
export const apiUpdateUser = async (body: UpdateUserBody): Promise<User> =>
	rastercarApi.patch(body, '/user/me').json<User>().then(userSchema.parse);

export const changePasswordBodySchema = z
	.object({
		oldPassword: z.string().min(5),
		newPassword: passwordValidator,
		newPasswordConfirmation: z.string()
	})
	.refine((data) => data.newPassword === data.newPasswordConfirmation, {
		message: "Passwords didn't match",
		path: ['passwordConfirmation']
	});

export type ChangePasswordBody = z.infer<typeof changePasswordBodySchema>;

/**
 * updates the user password
 */
export const apiChangePassword = async ({
	newPassword,
	oldPassword
}: ChangePasswordBody): Promise<string> =>
	rastercarApi.put({ newPassword, oldPassword }, '/user/me/password').json<string>();

/**
 * changes the current user profile picture
 */
export const updateUserProfilePicture = async (image: File): Promise<string> =>
	rastercarApi.formData({ image }).put(undefined, '/user/me/profile-picture').json<string>();

/**
 * deletes the current user profile picture
 */
export const removeUserProfilePicture = async (): Promise<string> =>
	rastercarApi.delete('/user/me/profile-picture').json<string>();
