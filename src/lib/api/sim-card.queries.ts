import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
import type { ApiQueryOptions, Paginated, PaginationParameters } from './common';
import { apiGetSimCards } from './sim-card';
import type { GetSimCardsFilters, SimCard } from './sim-card.schema';

export function apiGetSimCardsQuery(
	pagination: PaginationParameters,
	filters: GetSimCardsFilters,
	opts?: ApiQueryOptions<Paginated<SimCard>>
) {
	return createQuery(() => ({
		queryKey: ['sim-cards', pagination, filters],
		queryFn: () => apiGetSimCards({ pagination, filters }),
		placeholderData: keepPreviousData,
		...opts
	}));
}
