import type { User } from '$lib/api/auth';
import { localStorageStore } from '@skeletonlabs/skeleton';

interface AuthState {
	user: User | null;
}

export const authStore = localStorageStore<AuthState>('auth', { user: null });
