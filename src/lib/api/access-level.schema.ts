import { z } from 'zod';
import {
	createPaginatedResponseSchema,
	type Paginated,
	type PaginationWithFilters
} from './common';
import { rastercarApi, stripUndefined } from './utils';

export const accessLevelSchema = z.object({
	id: z.number(),
	createdAt: z.string(),
	name: z.string(),
	description: z.string(),
	isFixed: z.boolean(),
	permissions: z.array(z.string())
});

export type AccessLevel = z.infer<typeof accessLevelSchema>;

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
