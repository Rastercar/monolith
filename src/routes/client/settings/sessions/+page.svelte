<script lang="ts">
	import { apiGetCurrentUserSessions } from '$lib/api/user';
	import SessionList from '$lib/components/non-generic/session/SessionList.svelte';
	import { createQuery } from '@tanstack/svelte-query';

	const query = createQuery({
		queryKey: ['my-sessions'],
		queryFn: apiGetCurrentUserSessions
	});
</script>

<div class="space-y-6">
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
		<SessionList
			isSessionsFromCurrentlyLoggedUser
			class="sm:card sm:rounded-md"
			sessions={$query.data ?? []}
		/>
	{/if}
</div>
