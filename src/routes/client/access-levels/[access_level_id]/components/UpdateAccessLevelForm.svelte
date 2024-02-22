<script lang="ts">
	import type { AccessLevel } from '$lib/api/access-level.schema';
	import {
		groupPermissionsByCategory,
		permissionCategoryIcons,
		type PermissionDetails,
		type apiPermission,
		type apiPermissionCategory
	} from '$lib/constants/permissions';
	import Icon from '@iconify/svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	export let accessLevel: AccessLevel;

	let value = false;

	$: permissionsByCategory = Object.entries(
		groupPermissionsByCategory(accessLevel.permissions as apiPermission[])
	) as [[apiPermissionCategory, PermissionDetails[]]];
</script>

<label class="label">
	Name
	<input class="input" />
</label>

<label class="label mt-4">
	Description
	<textarea class="textarea" />
</label>

{#each permissionsByCategory as [category, permissions]}
	<div class="mt-6 mb-2 flex items-center">
		<Icon icon={permissionCategoryIcons[category]} class="mr-2" height={20} />
		{category}
	</div>

	<div class="grid gap-4 grid-cols-3">
		{#each permissions as permission}
			<div class="flex items-center gap-4">
				<SlideToggle name="slide" bind:checked={value} size="sm" />
				{permission.title}
			</div>
		{/each}
	</div>
{/each}
