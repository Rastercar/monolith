import { route } from '$lib/ROUTES';
import {
	createPaginatedResponseSchema,
	type Paginated,
	type PaginationWithFilters
} from './common';
import {
	simCardSchema,
	type GetSimCardsFilters,
	type SimCard,
	type UpdateSimCardBody,
	type UpdateSimCardRes
} from './sim-card.schema';
import { api, stripUndefined } from './utils';

/**
 * list paginated sim cards that belong to the same organization as the request user
 */
export const apiGetSimCards = (
	query?: PaginationWithFilters<GetSimCardsFilters>
): Promise<Paginated<SimCard>> =>
	api
		.query(stripUndefined({ ...query?.filters, ...query?.pagination }))
		.get(route('/client/tracking/sim-cards'))
		.json<Paginated<SimCard>>()
		.then(createPaginatedResponseSchema(simCardSchema).parse);

/**
 * update a sim card
 */
export function apiUpdateSimCard(id: number, body: UpdateSimCardBody): Promise<UpdateSimCardRes> {
	const url = route('PUT /client/tracking/sim-cards/[sim_card_id=integer]', {
		sim_card_id: id.toString()
	});

	return api.put(body, url).json<UpdateSimCardRes>();
}

/**
 * permanently deletes a SIM card
 */
export function apiDeleteSimCardById(id: number): Promise<string> {
	const url = route('DELETE /client/tracking/sim-cards/[sim_card_id=integer]', {
		sim_card_id: id.toString()
	});

	return api.delete(url).json<string>();
}
