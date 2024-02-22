import { accessLevelSchema, type AccessLevel } from './access-level.schema';
import { rastercarApi } from './utils';

/**
 * get a access level by id
 */
export const apiGetAccessLevelById = (id: number): Promise<AccessLevel> =>
	rastercarApi.get(`/user/${id}/access-level`).json<AccessLevel>().then(accessLevelSchema.parse);
