<script lang="ts">
	import type { AccessLevel } from '$lib/api/auth';
	import Icon from '@iconify/svelte';

	export let accessLevel: AccessLevel;
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

	<!-- TODO: decide on permissions enum so we can have a value -> description map -->
	<div class="opacity-80">permissions:</div>
	{#each accessLevel.permissions as permission}
		<h4 class="opacity-90 text-sm line-clamp-4 mt-1">
			{permission}
		</h4>
	{/each}
</div>
