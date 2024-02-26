import {
	accessLevelSchema,
	type AccessLevel,
	type CreateAccessLevelBody,
	type UpdateAccessLevelBody
} from './access-level.schema';
import {
	createPaginatedResponseSchema,
	type Paginated,
	type PaginationWithFilters
} from './common';
import { rastercarApi, stripUndefined } from './utils';

export interface GetAccessLevelsFilters {
	name?: string;
}

/**
 * list paginated access levels that belong to the same organization as the request user
 */
export const apiGetAccessLevels = (
	query?: PaginationWithFilters<GetAccessLevelsFilters>
): Promise<Paginated<AccessLevel>> =>
	rastercarApi
		.query(stripUndefined({ ...query?.pagination, ...query?.filters }))
		.get('/access-level')
		.json<Paginated<AccessLevel>>()
		.then(createPaginatedResponseSchema(accessLevelSchema).parse);

/**
 * create a acess level
 */
export const apiCreateAccessLevel = (body: CreateAccessLevelBody): Promise<AccessLevel> =>
	rastercarApi.post(body, '/access-level').json<AccessLevel>().then(accessLevelSchema.parse);

/**
 * get a access level by id
 */
export const apiGetAccessLevelById = (id: number): Promise<AccessLevel> =>
	rastercarApi.get(`/access-level/${id}`).json<AccessLevel>().then(accessLevelSchema.parse);

/**
 * delete a access level by id
 */
export const apiDeleteAccessLevel = (id: number): Promise<string> =>
	rastercarApi.delete(`/access-level/${id}`).json<string>();

/**
 * update a acess level
 */
export const apiUpdateAccessLevel = (
	id: number,
	body: UpdateAccessLevelBody
): Promise<AccessLevel> =>
	rastercarApi.put(body, `/access-level/${id}`).json<AccessLevel>().then(accessLevelSchema.parse);
