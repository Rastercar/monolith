import {
	createPaginatedResponseSchema,
	type Paginated,
	type PaginationWithFilters
} from './common';
import {
	simCardSchema,
	type CreateSimCardBody,
	type SimCard,
	type UpdateSimCardBody
} from './sim-card.schema';
import { rastercarApi, stripUndefined } from './utils';

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
	rastercarApi
		.query(stripUndefined({ ...query?.filters, ...query?.pagination }))
		.get('/sim-card')
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
	rastercarApi.post(body, '/sim-card').json<SimCard>().then(simCardSchema.parse);

/**
 * update a sim card
 *
 * ### required permissions
 *
 * - `UPDATE_SIM_CARD`
 */
export const apiUpdateSimCard = (id: number, body: UpdateSimCardBody): Promise<SimCard> =>
	rastercarApi.put(body, `/sim-card/${id}`).json<SimCard>().then(simCardSchema.parse);

/**
 * permanently deletes a SIM card
 */
export const apiDeleteSimCard = (id: number): Promise<string> =>
	rastercarApi.delete(`/sim-card/${id}`).json<string>();

/**
 * changes the tracker a SIM card is associated to
 */
export const apiSetSimCardTracker = (ids: {
	simCardId: number;
	newTrackerId: number | null;
}): Promise<string> =>
	rastercarApi
		.put({ trackerId: ids.newTrackerId }, `/sim-card/${ids.simCardId}/tracker`)
		.json<string>();
