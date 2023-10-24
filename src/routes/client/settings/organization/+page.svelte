<script lang="ts">
	import { apiGetUserSessions } from '$lib/api/auth';
	import { createQuery } from '@tanstack/svelte-query';

	const query = createQuery({
		queryKey: ['userSessions'],
		queryFn: apiGetUserSessions
	});
</script>

<div class="p-6 max-w-4xl mx-auto space-y-6">
	<h1 class="text-2xl">My organization</h1>

	<!-- TODO: fetch organization data and display ! -->
	{#if $query.isLoading}
		<p>loading...</p>
	{:else if $query.isError}
		<p class="text-error-500">failed to load your sessions</p>
	{/if}
</div>
