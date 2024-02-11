import { userSchema, type ChangePasswordBody, type UpdateUserBody, type User } from './user.schema';
import { rastercarApi } from './utils';

/**
 * gets the current user within the session id on the session ID cookie
 */
export const apiGetCurrentUser = (): Promise<User> =>
	rastercarApi.get('/user/me').json<User>().then(userSchema.parse);

/**
 * requests a email address confirmation email to be sent to the logged in user email address
 */
export const apiRequestUserEmailAddressConfirmationEmail = (): Promise<string> =>
	rastercarApi.post({}, '/user/me/request-email-address-confirmation').json<string>();

/**
 * updates and returns the updated current user
 */
export const apiUpdateUser = (body: UpdateUserBody): Promise<User> =>
	rastercarApi.patch(body, '/user/me').json<User>().then(userSchema.parse);

/**
 * updates the user password
 */
export const apiChangePassword = (body: ChangePasswordBody): Promise<string> =>
	rastercarApi
		.put({ newPassword: body.newPassword, oldPassword: body.oldPassword }, '/user/me/password')
		.json<string>();

/**
 * changes the current user profile picture
 */
export const updateUserProfilePicture = (image: File): Promise<string> =>
	rastercarApi.formData({ image }).put(undefined, '/user/me/profile-picture').json<string>();

/**
 * deletes the current user profile picture
 */
export const removeUserProfilePicture = (): Promise<string> =>
	rastercarApi.delete('/user/me/profile-picture').json<string>();
