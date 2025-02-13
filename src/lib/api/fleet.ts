import { route } from '$lib/ROUTES';
import {
	createPaginatedResponseSchema,
	type Paginated,
	type PaginationWithFilters
} from './common';
import { fleetSchema, type Fleet, type GetFleetsFilters } from './fleet.schema';
import { api, stripUndefined } from './utils';

/**
 * list paginated fleets that belong to the same organization as the request user
 */
export const apiGetFleets = (
	query?: PaginationWithFilters<GetFleetsFilters>
): Promise<Paginated<Fleet>> =>
	api
		.query(stripUndefined({ ...query?.pagination, ...query?.filters }))
		.get(route('/client/tracking/fleets'))
		.json<Paginated<Fleet>>()
		.then(createPaginatedResponseSchema(fleetSchema).parse);

/**
 * permanently deletes a fleet
 */
export function apiDeleteFleet(id: number): Promise<string> {
	const url = route('DELETE /client/tracking/fleets/[fleet_id=integer]', {
		fleet_id: id.toString()
	});

	return api.delete(url).json<string>();
}
