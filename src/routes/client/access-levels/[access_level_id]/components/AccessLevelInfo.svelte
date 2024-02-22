<script lang="ts">
	import type { AccessLevel } from '$lib/api/access-level.schema';
	import { getPermissionDetails } from '$lib/constants/permissions';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	export let accessLevel: AccessLevel;

	let showDetails = false;
</script>

<p class="opacity-90 text-sm line-clamp-4 mb-2">
	{accessLevel.description}
</p>

<hr class="my-4" />

<div class="mb-1 flex justify-between">
	<span>Permissions: </span>

	<span class="flex items-center">
		<span class="mr-3 text-sm">show details</span>
		<SlideToggle name="showDetailsInput" bind:checked={showDetails} size="sm" />
	</span>
</div>

<!-- TODO: aggregate by category, change info on other pages -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
	{#each accessLevel.permissions as permission}
		{@const details = getPermissionDetails(permission)}

		{#if details}
			<div>
				<span class="text-sm">{details.title}</span>

				{#if showDetails}
					<p class="text-xs text-surface-800-100-token">{details.description}</p>
				{/if}
			</div>
		{/if}
	{/each}
</div>
