<script lang="ts">
	import { apiGetUserSessions } from '$lib/api/user';
	import SessionList from '$lib/components/non-generic/session/SessionList.svelte';
	import { authStore } from '$lib/store/auth.svelte';
	import Icon from '@iconify/svelte';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { createQuery } from '@tanstack/svelte-query';

	export let userId: number;

	const query = createQuery({
		queryKey: ['user', userId, 'sessions'],
		queryFn: () => apiGetUserSessions(userId)
	});

	$: sessions = $query.data;

	$: isSessionsFromCurrentlyLoggedUser = ($authStore.user?.id ?? 0) === userId;
</script>

<div class="sm:card sm:rounded-lg">
	<Accordion padding="py-2" spacing="space-y-4">
		<AccordionItem open regionControl="bg-surface-200-700-token px-4" spacing="space-y-3">
			<svelte:fragment slot="summary">
				<div class="flex items-center py-2">
					<Icon icon="mdi:access-point" width="32" height="32" class="mr-2" />
					Sessions
				</div>
			</svelte:fragment>

			<svelte:fragment slot="content">
				<div>
					<p class="!mt-2 px-4 text-surface-700-200-token text-sm">
						All devices the user is currently logged in. Revoking any sessions will log off the user
						for that specific device.
					</p>

					{#if $query.isLoading}
						<p class="p-4">loading...</p>
					{:else if $query.isError}
						<p class="text-error-500 p-4">failed to load user sessions</p>
					{:else}
						<SessionList sessions={sessions ?? []} {isSessionsFromCurrentlyLoggedUser} />
					{/if}
				</div>
			</svelte:fragment>
		</AccordionItem>
	</Accordion>
</div>
