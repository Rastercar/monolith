import {
	createPaginatedResponseSchema,
	type Paginated,
	type PaginationWithFilters
} from './common';
import { simCardSchema, type SimCard } from './sim-card.schema';
import { rastercarApi, stripUndefined } from './utils';

export interface GetSimCardsFilters {
	phoneNumber?: string;
	withAssociatedTracker?: boolean;
}

/**
 * list paginated sim cards that belong to the same organization as the request user
 */
export const apiGetSimCards = async (
	query?: PaginationWithFilters<GetSimCardsFilters>
): Promise<Paginated<SimCard>> =>
	rastercarApi
		.query(stripUndefined({ ...query?.filters, ...query?.pagination }))
		.get('/sim-card')
		.json<Paginated<SimCard>>()
		.then(createPaginatedResponseSchema(simCardSchema).parse);
