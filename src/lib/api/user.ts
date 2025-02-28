import { route } from '$lib/ROUTES';
import {
	createPaginatedResponseSchema,
	type Paginated,
	type PaginationWithFilters
} from './common';
import { simpleUserSchema, type GetUsersFilters, type SimpleUser } from './user.schema';
import { api, stripUndefined } from './utils';

/**
 * list paginated users that belong to the same organization as the request user
 */
export const apiGetUsers = (
	query?: PaginationWithFilters<GetUsersFilters>
): Promise<Paginated<SimpleUser>> =>
	api
		.query(stripUndefined({ ...query?.pagination, ...query?.filters }))
		.get(route('/client/usuarios'))
		.json<Paginated<SimpleUser>>()
		.then(createPaginatedResponseSchema(simpleUserSchema).parse);

/**
 * delete a user by id
 */
export const apiDeleteUserById = (id: number): Promise<string> =>
	api
		.delete(route('DELETE /client/usuarios/[user_id=integer]', { user_id: id.toString() }))
		.json<string>();

/**
 * change a user access level
 */
export const apiChangeUserAccessLevel = (ids: {
	userId: number;
	accessLevelId: number;
}): Promise<string> => {
	const url = route('PUT /client/usuarios/[user_id=integer]/nivel-acesso', {
		user_id: ids.userId.toString()
	});

	return api.put({ accessLevelId: ids.accessLevelId }, url).json<string>();
};

/**
 * changes the current user profile picture
 */
export const apiUpdateUserProfilePicture = (image: File): Promise<string> =>
	api
		.formData({ image })
		.put(undefined, route('PUT /client/configuracoes/perfil/foto'))
		.json<string>();

/**
 * deletes the current user profile picture
 */
export const apiRemoveUserProfilePicture = (): Promise<string> =>
	api.delete(route('DELETE /client/configuracoes/perfil/foto')).json<string>();

/**
 * block a user by id, marking them as blocked and destroying their sessions
 */
export const apiBlockUser = (id: number): Promise<string> =>
	api
		.post({}, route('POST /client/usuarios/[user_id=integer]/bloquear', { user_id: id.toString() }))
		.json<string>();

/**
 * unblock a user by id
 */
export const apiUnblockUser = (id: number): Promise<string> =>
	api
		.post(
			{},
			route('POST /client/usuarios/[user_id=integer]/desbloquear', { user_id: id.toString() })
		)
		.json<string>();
