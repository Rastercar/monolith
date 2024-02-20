import { z } from 'zod';
import { createPaginatedResponseSchema, type Paginated, type PaginationParameters } from './common';
import {
	simpleUserSchema,
	userSchema,
	userSessionSchema,
	type ChangePasswordBody,
	type SimpleUser,
	type UpdateUserBody,
	type User,
	type UserSession
} from './user.schema';
import { rastercarApi, stripUndefined } from './utils';

/**
 * list paginated users that belong to the same organization as the request user
 */
export const apiGetUsers = (query?: PaginationParameters): Promise<Paginated<SimpleUser>> =>
	rastercarApi
		.query(stripUndefined(query))
		.get('/user')
		.json<Paginated<SimpleUser>>()
		.then(createPaginatedResponseSchema(simpleUserSchema).parse);

/**
 * get a user by ID
 */
export const apiGetUserById = (id: number): Promise<SimpleUser> =>
	rastercarApi.get(`/user/${id}`).json<SimpleUser>().then(simpleUserSchema.parse);

/**
 * get all sessions belonging to a user
 */
export const apiGetUserSessions = (id: number): Promise<UserSession[]> =>
	rastercarApi
		.get(`/user/${id}/sessions`)
		.json<UserSession[]>()
		.then(z.array(userSessionSchema).parse);

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
