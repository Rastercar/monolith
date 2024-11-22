import type { Organization } from '$lib/api/organization.schema';
import type { User } from '$lib/api/user.schema';
import type { apiPermission } from '$lib/constants/permissions';
import { useLocalStorage } from './local-storage-store.svelte';

interface AuthState {
	user: User | null;
}

const authS = useLocalStorage<AuthState>('auth', { user: null });

export const authStore = {
	getValue: () => authS.value,

	setUser: (user: User) => (authS.value.user = user),

	clearUser: () => (authS.value.user = null),

	removeUserPermissions: (permissionsToRemove: apiPermission[]) => {
		if (!authS.value.user) return;

		authS.value.user.accessLevel.permissions = authS.value.user.accessLevel.permissions.filter(
			(p) => !permissionsToRemove.includes(p as apiPermission)
		);
	},

	updateUser: (newUserData: Partial<User>) => {
		if (!authS.value.user) return;
		authS.value.user = { ...authS.value.user, ...newUserData };
	},

	updateUserOrg: (newOrgData: Partial<Organization>) => {
		if (!authS.value.user) return;
		authS.value.user.organization = { ...authS.value.user.organization, ...newOrgData };
	},

	setUserEmailAsVerified: () => {
		if (!authS.value.user) return;
		authS.value.user.emailVerified = true;
	}
};

/**
 * Checks if there is a currently logged in user containing one or more permissions
 */
export const hasPermission = (permission: apiPermission | apiPermission[]) => {
	const requiredPermissions = typeof permission === 'string' ? [permission] : permission;

	const s = $derived(
		requiredPermissions.every(
			(p) => authS.value.user && authS.value.user.accessLevel.permissions.includes(p)
		)
	);

	return s;
};
