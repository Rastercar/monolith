<script lang="ts">
	import { apiGetUserSessions } from '$lib/api/user';
	import SessionList from '$lib/components/non-generic/session/SessionList.svelte';
	import Icon from '@iconify/svelte';
	import { createQuery } from '@tanstack/svelte-query';

	export let userId: number;

	const query = createQuery({
		queryKey: ['user', userId, 'sessions'],
		queryFn: () => apiGetUserSessions(userId)
	});

	$: sessions = $query.data;
</script>

<div class="card">
	<h2 class="text-xl px-4 pt-4">Sessions</h2>

	<p class="!mt-1 px-4 text-surface-700-200-token text-sm">
		All devices the user logged in to his/hers account. Revoking any sessions will log off the user
		for that specific device.
	</p>

	<hr class="mt-4" />

	{#if $query.isLoading}
		<p>loading...</p>
	{:else if $query.isError}
		<p class="text-error-500">failed to load user sessions</p>
	{:else if (sessions?.length || 0) > 0}
		<!-- TODO: bloquear botao de revogar sessão caso não seja o usuario atual / não tenha permissão, ver todo.txt com ideia pro componente  -->
		<SessionList sessions={sessions ?? []} />
	{:else}
		<span class="mt-4 flex items-center px-4 pb-4">
			<Icon icon="mdi:info" class="mr-2" />
			no sessions found
		</span>
	{/if}
</div>
