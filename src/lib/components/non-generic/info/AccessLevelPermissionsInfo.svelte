<script lang="ts">
	import type { AccessLevel } from '$lib/api/access-level.schema';
	import {
		groupPermissionsByCategory,
		permissionCategoryIcons,
		type PermissionDetailsAndKey,
		type apiPermission,
		type apiPermissionCategory
	} from '$lib/constants/permissions';
	import Icon from '@iconify/svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	interface Props {
		accessLevel: AccessLevel;
	}

	let { accessLevel }: Props = $props();

	let showDetails = $state(true);

	let permissionsByCategory = $derived(Object.entries(
		groupPermissionsByCategory(accessLevel.permissions as apiPermission[])
	) as [[apiPermissionCategory, PermissionDetailsAndKey[]]]);
</script>

<div class="mb-1 flex justify-between">
	<span>Permissions: </span>

	<span class="flex items-center">
		<span class="mr-3 text-sm">show details</span>
		<SlideToggle name="showDetailsInput" bind:checked={showDetails} size="sm" />
	</span>
</div>

{#each permissionsByCategory as [category, permissions], i}
	<div class="flex flex-col space-y-4">
		<div class="flex items-center text-lg">
			<Icon icon={permissionCategoryIcons[category]} class="mr-2" height={20} />
			{category}
		</div>

		{#each permissions as permissionDetails}
			<div>
				{permissionDetails.summary}

				{#if showDetails}
					<p class="text-xs mt-1">
						{permissionDetails.description}
					</p>
				{/if}
			</div>
		{/each}
	</div>

	{#if i !== permissionsByCategory.length - 1}
		<hr class="my-4" />
	{/if}
{:else}
	no permissions found
{/each}
