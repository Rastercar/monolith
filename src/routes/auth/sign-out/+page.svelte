<script lang="ts">
	import { goto } from '$app/navigation';
	import { route } from '$lib/ROUTES';
	import { authStore } from '$lib/store/auth';
	import { awaitPromiseWithMinimumTimeOf } from '$lib/utils/promises';
	import { onMount } from 'svelte';

	/**
	 * calls the sveltekit server to delete the session cookie
	 */
	const destroySession = async () => fetch(route('/auth/sign-out'), { method: 'POST' });

	// reset the user state
	onMount(() => {
		authStore.clearUser();

		const logoutPromise = destroySession().catch(() => {
			// if destroying the session cookies failed the user is now stuck with a unwanted/ invalid session cookie
			throw new Error('a critical error happened, please clear your browser cookies');
		});

		awaitPromiseWithMinimumTimeOf(logoutPromise, 200).then(() => goto('/auth/sign-in'));
	});
</script>

<div class="min-h-screen text-center pt-12 bg-surface-100-800-token">
	<h1>signing out...</h1>
</div>
