<script lang="ts">
	import { apiGetUserSessions } from '$lib/api/auth';
	import { createQuery } from '@tanstack/svelte-query';
	import SessionList from '../../../settings/sessions/components/SessionList.svelte';

	export let userId: number;

	// TODO: query by user ID
	const query = createQuery({
		queryKey: ['userSessions'],
		queryFn: apiGetUserSessions
	});

	$: sessions = $query.data;
</script>

<h2 class="text-xl">Sessions</h2>

<p class="!mt-1 text-surface-700-200-token text-sm">
	This is a list of devices the user logged in to his/hers account. Revoking any sessions will log
	off the user for that specific device.
</p>

{#if $query.isLoading}
	<p>loading...</p>
{:else if $query.isError}
	<p class="text-error-500">failed to load user sessions</p>
{:else}
	<!-- TODO: i should be moved to the components folder -->
	<SessionList sessions={sessions ?? []} />
{/if}
