import { userSchema, type ChangePasswordBody, type UpdateUserBody, type User } from './user.schema';
import { rastercarApi, redirectOnSessionError } from './utils';

/**
 * gets the current user within the session id on the session ID cookie
 */
export const apiGetCurrentUser = async (): Promise<User> =>
	rastercarApi.get('/user/me').json<User>().catch(redirectOnSessionError).then(userSchema.parse);

/**
 * requests a email address confirmation email to be sent to the logged in user email address
 */
export const apiRequestUserEmailAddressConfirmationEmail = async (): Promise<string> =>
	rastercarApi.post({}, '/user/me/request-email-address-confirmation').json<string>();

/**
 * updates and returns the updated current user
 */
export const apiUpdateUser = async (body: UpdateUserBody): Promise<User> =>
	rastercarApi.patch(body, '/user/me').json<User>().then(userSchema.parse);

/**
 * updates the user password
 */
export const apiChangePassword = async (body: ChangePasswordBody): Promise<string> =>
	rastercarApi
		.put({ newPassword: body.newPassword, oldPassword: body.oldPassword }, '/user/me/password')
		.json<string>();

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
