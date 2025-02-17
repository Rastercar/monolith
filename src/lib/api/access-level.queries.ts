import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
import { apiDeleteAccessLevel, apiGetAccessLevels } from './access-level';
import type { GetAccessLevelFilters } from './access-level.schema';
import { createMutation, type PaginationParameters } from './common';

export function apiGetAccessLevelsQuery(
	pagination: PaginationParameters,
	filters: GetAccessLevelFilters
) {
	return createQuery(() => ({
		queryKey: ['access-level', pagination, filters],
		queryFn: () => apiGetAccessLevels({ pagination, filters }),
		placeholderData: keepPreviousData
	}));
}

export function apiGetAccessLevelsAsSelectOptionsQuery(name: string) {
	const pagination = { page: 1, pageSize: 100 };

	return createQuery(() => ({
		queryKey: ['access-level', 'select-options', name],
		queryFn: async () => {
			const { records } = await apiGetAccessLevels({ pagination, filters: { name } });
			return records.map((i) => ({ label: i.name, value: i.id.toString(), original: i }));
		},
		placeholderData: keepPreviousData
	}));
}

export function apiDeleteUserByIdMutation() {
	return createMutation({ fn: apiDeleteAccessLevel });
}
