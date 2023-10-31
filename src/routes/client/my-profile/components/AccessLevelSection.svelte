<script lang="ts">
	import type { AccessLevel } from '$lib/api/auth.schema';
	import {
		permissionDetails,
		type PermissionDetails,
		type apiPermission
	} from '$lib/constants/permissions';
	import Icon from '@iconify/svelte';

	export let accessLevel: AccessLevel;

	const getPermissionDetails = (permission: string): PermissionDetails | null => {
		return permissionDetails[permission as apiPermission] ?? null;
	};
</script>

<div class="sm:card sm:p-4 sm:rounded-lg">
	<h3 class="mb-2 text-lg flex items-center">
		<Icon icon="mdi:lock" width="32" height="32" class="mr-2" />
		Role and Permissions
	</h3>

	<h4>
		<span class="opacity-80 mt-2">Access Level:</span>
		{accessLevel.name}
	</h4>

	<h4 class="opacity-90 text-sm line-clamp-4 mb-2">
		{accessLevel.description}
	</h4>

	<div class="opacity-80 mt-4">permissions:</div>
	<ul>
		{#each accessLevel.permissions as permission}
			{@const details = getPermissionDetails(permission)}

			{#if details}
				<li class="mt-1">
					<span class="text-sm font-semibold">{details.title}</span>
					<p class="text-sm text-surface-800-100-token">{details.description}</p>
				</li>
			{/if}
		{/each}
	</ul>
</div>
