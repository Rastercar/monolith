<script lang="ts">
	import { goto } from '$app/navigation';
	import { apiSignOut } from '$lib/api/auth';
	import { authStore } from '$lib/store/auth';
	import { getToaster } from '$lib/store/toaster';
	import { onMount } from 'svelte';

	const toaster = getToaster();

	/**
	 * calls the sveltekit server to delete the session cookie
	 */
	const deleteSessionCookie = async (): Promise<boolean> => {
		const response = await fetch('/auth/sign-out', { method: 'POST' }).catch(() => ({ ok: false }));
		return response.ok;
	};

	onMount(() => {
		// reset the global auth state
		authStore.clearUser();

		let deleteOnRastercarApiFailed = false;

		// first we sign out of the rastercar API
		apiSignOut()
			.catch(() => {
				deleteOnRastercarApiFailed = true;
			})
			// we call the server to delete the session cookie regardless of
			// of the result of the apiSignOut just to be sure the cookie will
			// still be deleted even the server did not respond
			.then(deleteSessionCookie)
			.catch(() => {
				// if the deletion on the rastercar api went ok, the session id cookie got
				// replaced by a expired one that will be deleted on a next request, so move
				// forward
				if (!deleteOnRastercarApiFailed) return;

				// if both the rastercar api and the svelte server failed, then the sign out
				// did not delete the cookies, this is a worse case scenario and the user is
				// now stuck with a unwanted, or possibly even worse, a invalid session cookie
				//
				// as pathetic as this is, ask the user to delete the cookies.
				toaster.error('a critical error happened, please clear your browser cookies');

				throw new Error('failed to delete session');
			})
			.then(() => {
				goto('/auth/sign-in');
			});
	});
</script>

<div class="min-h-screen text-center pt-12 bg-surface-100-800-token">
	<h1>signing out...</h1>
</div>
