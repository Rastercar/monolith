import type { User } from '$lib/api/auth';
import { localStorageStore } from '@skeletonlabs/skeleton';

interface AuthState {
	user: User | null;
}

const { subscribe, set, update } = localStorageStore<AuthState>('auth', { user: null });

export const authStore = {
	set,
	update,
	subscribe,
	setUser: (user: User) => set({ user }),
	clearUser: () => set({ user: null }),
	setUserEmailAsVerified: () =>
		update((v) => {
			if (v.user) v.user.emailVerified = true;
			return { user: v.user };
		})
};
