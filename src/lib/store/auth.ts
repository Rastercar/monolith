import type { Organization, User } from '$lib/api/auth';
import { localStorageStore } from '@skeletonlabs/skeleton';

interface AuthState {
	user: User | null;
}

const { subscribe, set, update } = localStorageStore<AuthState>('auth', { user: null });

export const authStore = {
	subscribe,

	setUser: (user: User) => set({ user }),

	clearUser: () => set({ user: null }),

	updateUser: (newUserData: Partial<User>) => {
		update((state) => {
			if (state.user) state.user = { ...state.user, ...newUserData };
			return state;
		});
	},

	updateUserOrg: (newOrgData: Partial<Organization>) => {
		update((state) => {
			if (state.user) state.user.organization = { ...state.user.organization, ...newOrgData };
			return state;
		});
	},

	setUserEmailAsVerified: () =>
		update((v) => {
			if (v.user) v.user.emailVerified = true;
			return { user: v.user };
		})
};
