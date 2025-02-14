import { showErrorToast } from '$lib/store/toast';
import { promiseWithMinimumTimeOf } from '$lib/utils/promises';
import { createMutation, createQuery, keepPreviousData } from '@tanstack/svelte-query';
import type { PaginationParameters } from './common';
import {
	apiBlockUser,
	apiChangeUserAccessLevel,
	apiDeleteUserById,
	apiGetUsers,
	apiUnblockUser
} from './user';
import type { GetUsersFilters } from './user.schema';

export function apiGetUsersQuery(pagination: PaginationParameters, filters: GetUsersFilters) {
	return createQuery(() => ({
		queryKey: ['users', pagination, filters],
		queryFn: () => apiGetUsers({ pagination, filters }),
		placeholderData: keepPreviousData
	}));
}

export function apiDeleteUserByIdMutation() {
	return createMutation(() => ({
		mutationFn: (id: number) => apiDeleteUserById(id),
		onError: showErrorToast
	}));
}

export function apiChangeUserAccessLevelMutation() {
	return createMutation(() => ({
		mutationFn: (ids: { userId: number; accessLevelId: number }) => apiChangeUserAccessLevel(ids),
		onError: showErrorToast
	}));
}
export function apiSetUserBlockedMutation() {
	return createMutation(() => ({
		mutationFn: ({ userId, block }: { userId: number; block: boolean }) => {
			const promise = block ? apiBlockUser(userId) : apiUnblockUser(userId);
			return promiseWithMinimumTimeOf(promise, 500);
		}
	}));
}
