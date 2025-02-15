import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
import {
	createApiMutation,
	type ApiMutation,
	type ApiQueryOptions,
	type Paginated,
	type PaginationParameters
} from './common';
import { apiDeleteSimCardById, apiGetSimCards, apiUpdateSimCard } from './sim-card';
import type {
	GetSimCardsFilters,
	SimCard,
	UpdateSimCardBody,
	UpdateSimCardRes
} from './sim-card.schema';

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

export function apiDeleteSimCardByIdMutation(opts?: ApiMutation<string, number>) {
	return createApiMutation({ fn: apiDeleteSimCardById, ...opts });
}

export function apiUpdateSimCardMutation(
	opts?: ApiMutation<UpdateSimCardRes, { id: number; body: UpdateSimCardBody }>
) {
	return createApiMutation({
		fn: ({ id, body }: { id: number; body: UpdateSimCardBody }) => apiUpdateSimCard(id, body),
		...opts
	});
}
