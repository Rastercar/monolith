import { showErrorToast } from '$lib/store/toast';
import { createMutation, createQuery, keepPreviousData } from '@tanstack/svelte-query';
import type { PaginationParameters } from './common';
import { apiDeleteUserById, apiGetUsers } from './user';
import type { GetUsersFilters } from './user.schema';

export function apiGetUsersQuery(pagination: PaginationParameters, filters: GetUsersFilters) {
	return createQuery(() => ({
		queryKey: ['users', pagination, filters],
		queryFn: () => apiGetUsers({ pagination, filters }),
		placeholderData: keepPreviousData
	}));
}

export function apiDeleteUserByIdMutation(userId: number) {
	return createMutation(() => ({
		mutationFn: () => apiDeleteUserById(userId),
		onError: showErrorToast
	}));
}
