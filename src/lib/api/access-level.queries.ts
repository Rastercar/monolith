import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
import { apiDeleteAccessLevel, apiGetAccessLevels } from './access-level';
import type { GetAccessLevelFilters } from './access-level.schema';
import { createMutation, type PaginationParameters } from './common';

export function apiGetAccessLevelsQuery(
	pagination: PaginationParameters,
	filters: GetAccessLevelFilters
) {
	return createQuery(() => ({
		queryKey: ['fleets', pagination, filters],
		queryFn: () => apiGetAccessLevels({ pagination, filters }),
		placeholderData: keepPreviousData
	}));
}

export function apiDeleteUserByIdMutation() {
	return createMutation({ fn: apiDeleteAccessLevel });
}
