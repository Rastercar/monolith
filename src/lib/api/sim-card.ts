import { route } from '$lib/ROUTES';
import {
	createPaginatedResponseSchema,
	type Paginated,
	type PaginationWithFilters
} from './common';
import {
	simCardSchema,
	type CreateSimCardBody,
	type SimCard,
	type UpdateSimCardBody,
	type UpdateSimCardRes
} from './sim-card.schema';
import { api, stripUndefined } from './utils';

export interface GetSimCardsFilters {
	phoneNumber?: string;
	withAssociatedTracker?: boolean;
}

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
 * creates a new SIM card
 *
 * ### required permissions
 *
 * - `CREATE_SIM_CARD`
 */
export const apiCreateSimCard = (body: CreateSimCardBody): Promise<SimCard> =>
	api.post(body, '/sim-card').json<SimCard>().then(simCardSchema.parse);

/**
 * update a sim card
 *
 * ### required permissions
 *
 * - `UPDATE_SIM_CARD`
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
export function apiDeleteSimCard(id: number): Promise<string> {
	const url = route('DELETE /client/tracking/sim-cards/[sim_card_id=integer]', {
		sim_card_id: id.toString()
	});

	return api.delete(url).json<string>();
}
