import type { Organization } from '$lib/api/organization.schema';
import type { User } from '$lib/api/user.schema';
import type { apiPermission } from '$lib/constants/permissions';
import { localStorageStore } from '@skeletonlabs/skeleton';
import { derived } from 'svelte/store';

interface AuthState {
	user: User | null;
}

const store = localStorageStore<AuthState>('auth', { user: null });

export const authStore = {
	subscribe: store.subscribe,

	setUser: (user: User) => store.set({ user }),

	clearUser: () => store.set({ user: null }),

	updateUser: (newUserData: Partial<User>) => {
		store.update((state) => {
			if (state.user) state.user = { ...state.user, ...newUserData };
			return state;
		});
	},

	updateUserOrg: (newOrgData: Partial<Organization>) => {
		store.update((state) => {
			if (state.user) state.user.organization = { ...state.user.organization, ...newOrgData };
			return state;
		});
	},

	setUserEmailAsVerified: () =>
		store.update((v) => {
			if (v.user) v.user.emailVerified = true;
			return { user: v.user };
		})
};

/**
 * Checks if there is a currently logged in user containing one or more permissions
 */
export const hasPermission = derived(store, ($store) => {
	return (permission: apiPermission | apiPermission[]): boolean => {
		const requiredPermissions = typeof permission === 'string' ? [permission] : permission;

		return requiredPermissions.every(
			(p) => $store.user && $store.user.accessLevel.permissions.includes(p)
		);
	};
});
