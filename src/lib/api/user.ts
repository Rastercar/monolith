import { userSchema, type User } from './auth';
import { rastercarApi, redirectOnSessionError } from './common';

/**
 * gets the current user within the session id on the session ID cookie
 */
export const apiGetCurrentUser = async (): Promise<User> =>
	rastercarApi.get('/user/me').json<User>().catch(redirectOnSessionError).then(userSchema.parse);

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
