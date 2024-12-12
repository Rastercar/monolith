import { route } from '$lib/ROUTES';
import { z } from 'zod';
import { accessLevelSchema, type AccessLevel } from './access-level.schema';
import {
	createPaginatedResponseSchema,
	type Paginated,
	type PaginationWithFilters
} from './common';
import {
	simpleUserSchema,
	userSchema,
	userSessionSchema,
	type CreateUserBody,
	type GetUsersFilters,
	type SimpleUser,
	type UpdateUserBody,
	type User,
	type UserSession
} from './user.schema';
import { api, stripUndefined } from './utils';

/**
 * list paginated users that belong to the same organization as the request user
 */
export const apiGetUsers = (
	query?: PaginationWithFilters<GetUsersFilters>
): Promise<Paginated<SimpleUser>> =>
	api
		.query(stripUndefined({ ...query?.pagination, ...query?.filters }))
		.get(route('/client/users'))
		.json<Paginated<SimpleUser>>()
		.then(createPaginatedResponseSchema(simpleUserSchema).parse);

/**
 * create a new user
 */
export const apiCreateUser = (body: CreateUserBody) =>
	api.post(body, '/user').json<SimpleUser>().then(simpleUserSchema.parse);

/**
 * get a user by ID
 */
export const apiGetUserById = (id: number): Promise<SimpleUser> =>
	api.get(`/user/${id}`).json<SimpleUser>().then(simpleUserSchema.parse);

/**
 * delete a user by id
 */
export const apiDeleteUserById = (id: number): Promise<string> =>
	api
		.delete(route('DELETE /client/users/[user_id=integer]', { user_id: id.toString() }))
		.json<string>();

/**
 * gets a short lived token for the currently logged in user
 */
export const apiGetJwtForCurrentUser = async (): Promise<string> =>
	api.get('/user/me/short-lived-token').json<string>();

/**
 * get all sessions belonging to a user
 */
export const apiGetUserSessions = (id: number): Promise<UserSession[]> =>
	api.get(`/user/${id}/session`).json<UserSession[]>().then(z.array(userSessionSchema).parse);

/**
 * get a user access level
 */
export const apiGetUserAccessLevel = (id: number): Promise<AccessLevel> =>
	api.get(`/user/${id}/access-level`).json<AccessLevel>().then(accessLevelSchema.parse);

/**
 * change a user access level
 */
export const apiChangeUserAccessLevel = (ids: {
	userId: number;
	accessLevelId: number;
}): Promise<string> => {
	const url = route('PUT /client/users/[user_id=integer]/access-level', {
		user_id: ids.userId.toString()
	});

	return api.put({ accessLevelId: ids.accessLevelId }, url).json<string>();
};

/**
 * gets the current user within the session id on the session ID cookie
 */
export const apiGetCurrentUser = (): Promise<User> =>
	api.get('/user/me').json<User>().then(userSchema.parse);

/**
 * requests a email address confirmation email to be sent to the logged in user email address
 */
export const apiRequestUserEmailAddressConfirmationEmail = (): Promise<string> =>
	api.post({}, '/user/me/request-email-address-confirmation').json<string>();

/**
 * updates and returns the updated current user
 */
export const apiUpdateUser = (body: UpdateUserBody): Promise<User> =>
	api.patch(body, '/user/me').json<User>().then(userSchema.parse);

/**
 * changes the current user profile picture
 */
export const updateUserProfilePicture = (image: File): Promise<string> =>
	api
		.formData({ image })
		.put(undefined, route('PUT /client/settings/profile/picture'))
		.json<string>();

/**
 * deletes the current user profile picture
 */
export const removeUserProfilePicture = (): Promise<string> =>
	api.delete(route('DELETE /client/settings/profile/picture')).json<string>();
