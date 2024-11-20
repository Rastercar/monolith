import type { User } from '$lib/api/user.schema';
import { localStore } from './local-storage-store.svelte';

interface AuthState {
	user: User | null;
}

const store = localStore<AuthState>('auth', { user: null });

// TODO: !
export const authStore = {
	// setUser: (user: User) => store.set({ user }),
	// clearUser: () => store.set({ user: null }),
	// removeUserPermissions: (permissionsToRemove: apiPermission[]) => {
	// 	store.update((state) => {
	// 		if (state.user) {
	// 			state.user.accessLevel.permissions = state.user.accessLevel.permissions.filter(
	// 				(p) => !permissionsToRemove.includes(p as apiPermission)
	// 			);
	// 		}
	// 		return state;
	// 	});
	// },
	// updateUser: (newUserData: Partial<User>) => {
	// 	store.update((state) => {
	// 		if (state.user) state.user = { ...state.user, ...newUserData };
	// 		return state;
	// 	});
	// },
	// updateUserOrg: (newOrgData: Partial<Organization>) => {
	// 	store.update((state) => {
	// 		if (state.user) state.user.organization = { ...state.user.organization, ...newOrgData };
	// 		return state;
	// 	});
	// },
	// setUserEmailAsVerified: () =>
	// 	store.update((v) => {
	// 		if (v.user) v.user.emailVerified = true;
	// 		return { user: v.user };
	// 	})
};

/**
 * Checks if there is a currently logged in user containing one or more permissions
 */
// export const hasPermission = derived(store, ($store) => {
// 	return (permission: apiPermission | apiPermission[]): boolean => {
// 		const requiredPermissions = typeof permission === 'string' ? [permission] : permission;

// 		return requiredPermissions.every(
// 			(p) => $store.user && $store.user.accessLevel.permissions.includes(p)
// 		);
// 	};
// });
