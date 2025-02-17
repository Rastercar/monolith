import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
import { createMutation, type ApiMutation, type PaginationParameters } from './common';
import { apiDeleteFleet, apiGetFleets } from './fleet';
import type { GetFleetsFilters } from './fleet.schema';

export function apiGetFleetsQuery(pagination: PaginationParameters, filters: GetFleetsFilters) {
	return createQuery(() => ({
		queryKey: ['fleets', pagination, filters],
		queryFn: () => apiGetFleets({ pagination, filters }),
		placeholderData: keepPreviousData
	}));
}

export function apiGetFleetsAsSelectOptionsQuery(filters: GetFleetsFilters) {
	const pagination = { page: 1, pageSize: 100 };

	return createQuery(() => ({
		queryKey: ['fleets', 'select-options', filters],
		queryFn: async () => {
			const { records } = await apiGetFleets({ pagination, filters });
			return records.map((i) => ({ label: i.name, value: i.id.toString(), original: i }));
		},
		placeholderData: keepPreviousData
	}));
}

export function apiDeleteFleetMutation(opts?: ApiMutation<string, number>) {
	return createMutation({ fn: apiDeleteFleet, ...opts });
}
