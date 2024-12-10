import { route } from '$lib/ROUTES';
import {
	accessLevelSchema,
	type AccessLevel,
	type GetAccessLevelFilters
} from './access-level.schema';
import {
	createPaginatedResponseSchema,
	type Paginated,
	type PaginationWithFilters
} from './common';
import { api, stripUndefined } from './utils';

/**
 * list paginated access levels that belong to the same organization as the request user
 */
export const apiGetAccessLevels = (
	query?: PaginationWithFilters<GetAccessLevelFilters>
): Promise<Paginated<AccessLevel>> =>
	api
		.query(stripUndefined({ ...query?.pagination, ...query?.filters }))
		.get(route('/client/access-levels'))
		.json<Paginated<AccessLevel>>()
		.then(createPaginatedResponseSchema(accessLevelSchema).parse);

/**
 * delete a access level by id
 */
export const apiDeleteAccessLevel = (id: number): Promise<string> => {
	const url = route('DELETE /client/access-levels/[access_level_id=integer]', {
		access_level_id: id.toString()
	});

	return api.delete(url).json<string>();
};
