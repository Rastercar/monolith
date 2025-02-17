import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
import { createMutation, type ApiMutation, type PaginationParameters } from './common';
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

export function apiDeleteUserByIdMutation(opts?: ApiMutation<string, number>) {
	return createMutation({ fn: apiDeleteUserById, ...opts });
}

export function apiChangeUserAccessLevelMutation(
	opts?: ApiMutation<string, { userId: number; accessLevelId: number }>
) {
	return createMutation({ fn: apiChangeUserAccessLevel, ...opts });
}

export function apiSetUserBlockedMutation(
	opts?: ApiMutation<string, { userId: number; block: boolean }>
) {
	return createMutation({
		fn: ({ userId, block }) => (block ? apiBlockUser(userId) : apiUnblockUser(userId)),
		...opts
	});
}
