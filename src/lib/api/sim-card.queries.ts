import { createMutation, createQuery, keepPreviousData } from '@tanstack/svelte-query';
import type {
	ApiMutationOptions,
	ApiQueryOptions,
	Paginated,
	PaginationParameters
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

export function apiDeleteSimCardByIdMutation(opts?: ApiMutationOptions<string, unknown, number>) {
	return createMutation(() => ({
		mutationFn: (id: number) => apiDeleteSimCardById(id),
		...opts
	}));
}

export function apiUpdateSimCardMutation(
	opts?: ApiMutationOptions<UpdateSimCardRes, unknown, { id: number; body: UpdateSimCardBody }>
) {
	return createMutation(() => ({
		mutationFn: ({ id, body }: { id: number; body: UpdateSimCardBody }) =>
			apiUpdateSimCard(id, body),
		...opts
	}));
}
