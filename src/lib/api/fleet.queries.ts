import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
import type { PaginationParameters } from './common';
import { apiGetFleets } from './fleet';
import type { GetFleetsFilters } from './fleet.schema';

export function apiGetFleetsQuery(pagination: PaginationParameters, filters: GetFleetsFilters) {
	return createQuery(() => ({
		queryKey: ['fleets', pagination, filters],
		queryFn: () => apiGetFleets({ pagination, filters }),
		placeholderData: keepPreviousData
	}));
}
