<script lang="ts">
	import { apiGetUserSessions } from '$lib/api/auth';
	import { createQuery } from '@tanstack/svelte-query';
	import SessionList from './components/SessionList.svelte';

	const query = createQuery({
		queryKey: ['userSessions'],
		queryFn: apiGetUserSessions
	});
</script>

<div class="p-6 max-w-4xl mx-auto space-y-6">
	<h1 class="text-2xl">Your web sessions</h1>
	<h2 class="!mt-3 text-surface-700-200-token text-sm">
		This is a list of devices that have logged into your account. Revoke any sessions that you do
		not recognize.
	</h2>

	{#if $query.isLoading}
		<p>loading...</p>
	{:else if $query.isError}
		<p class="text-error-500">failed to load your sessions</p>
	{:else}
		<SessionList sessions={$query.data} />
	{/if}
</div>
