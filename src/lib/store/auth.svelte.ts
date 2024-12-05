import type { Organization } from '$lib/api/organization.schema';
import type { User } from '$lib/api/user.schema';
import type { permission } from '$lib/constants/permissions';
import { wrapToArray } from '$lib/utils/arrays';
import { getContext, setContext } from 'svelte';
import { AUTH_CONTEXT_KEY } from './keys';

class AuthStore {
	user = $state<User | null>(null);

	setUser(user: User) {
		this.user = user;
	}

	clearUser() {
		this.user = null;
	}

	removeUserPermissions(permissionsToRemove: permission[]) {
		if (!this.user) return;

		this.user.accessLevel.permissions = this.user.accessLevel.permissions.filter(
			(p) => !permissionsToRemove.includes(p as permission)
		);
	}

	updateUser(newUserData: Partial<User>) {
		if (!this.user) return;
		this.user = { ...this.user, ...newUserData };
	}

	updateUserOrg(newOrgData: Partial<Organization>) {
		if (!this.user) return;
		this.user.organization = { ...this.user.organization, ...newOrgData };
	}

	setUserEmailAsVerified() {
		if (!this.user) return;
		this.user.emailVerified = true;
	}

	/**
	 * Checks if there is a currently logged in user containing one or more permissions
	 */
	hasPermission(permission: permission | permission[]) {
		const u = this.user;
		if (!u) return false;

		const requiredPermissions = wrapToArray(permission);
		return requiredPermissions.every((p) => u.accessLevel.permissions.includes(p));
	}
}

export const setAuthContext = () => setContext(AUTH_CONTEXT_KEY, new AuthStore());

export const getAuthContext = () => getContext<ReturnType<typeof setAuthContext>>(AUTH_CONTEXT_KEY);
