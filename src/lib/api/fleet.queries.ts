import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
import { createApiMutation, type ApiMutation, type PaginationParameters } from './common';
import { apiDeleteFleet, apiGetFleets } from './fleet';
import type { GetFleetsFilters } from './fleet.schema';

export function apiGetFleetsQuery(pagination: PaginationParameters, filters: GetFleetsFilters) {
	return createQuery(() => ({
		queryKey: ['fleets', pagination, filters],
		queryFn: () => apiGetFleets({ pagination, filters }),
		placeholderData: keepPreviousData
	}));
}

export function apiDeleteFleetMutation(opts?: ApiMutation<string, number>) {
	return createApiMutation({ fn: apiDeleteFleet, ...opts });
}
