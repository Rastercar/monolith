<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/store/auth';
	import { onMount } from 'svelte';

	authStore.set({ user: null });

	onMount(() => {
		setTimeout(() => {
			goto('/auth/sign-in');
		}, 500);
	});
</script>

<div class="min-h-screen text-center pt-12 bg-surface-100-800-token">
	<h1>signing out...</h1>
</div>
