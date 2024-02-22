<script lang="ts">
	import { apiGetUserAccessLevel } from '$lib/api/user';
	import { getPermissionDetails } from '$lib/constants/permissions';
	import Icon from '@iconify/svelte';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { createQuery } from '@tanstack/svelte-query';

	export let userId: number;

	const query = createQuery({
		queryKey: ['user', userId, 'access-level'],
		queryFn: () => apiGetUserAccessLevel(userId)
	});

	$: ({ data: accessLevel, error, isLoading } = $query);
</script>

<div class="sm:card sm:rounded-lg">
	<Accordion padding="py-2" spacing="space-y-4">
		<AccordionItem regionControl="bg-surface-200-700-token px-4" spacing="space-y-3">
			<svelte:fragment slot="summary">
				<div class="flex items-center py-2">
					<Icon icon="mdi:lock" width="32" height="32" class="mr-2" />
					Role and Permissions
				</div>
			</svelte:fragment>

			<svelte:fragment slot="content">
				{#if error}
					<div class="p-4 text-error-500">Error loading access level</div>
				{:else if isLoading}
					<div class="p-4">loading</div>
				{:else if accessLevel}
					<div class="sm:px-4 py-2">
						<h4>
							<span class="opacity-80 mt-2">Access Level:</span>
							{accessLevel.name}
						</h4>

						<h4 class="opacity-90 text-sm line-clamp-4 mb-2">
							{accessLevel.description}
						</h4>

						<div class="opacity-80 mt-4 mb-1">Permissions:</div>
						<ul class="space-y-2">
							{#each accessLevel.permissions as permission}
								{@const details = getPermissionDetails(permission)}

								{#if details}
									<li>
										<span class="text-sm">{details.title}</span>
										<p class="text-xs text-surface-800-100-token">{details.description}</p>
									</li>
								{/if}
							{/each}
						</ul>
					</div>
				{/if}
			</svelte:fragment>
		</AccordionItem>
	</Accordion>
</div>
