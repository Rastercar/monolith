import type { Organization, User } from '$lib/api/auth';
import { localStorageStore } from '@skeletonlabs/skeleton';

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
