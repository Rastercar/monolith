<script lang="ts">
	import type { AccessLevel } from '$lib/api/access-level.schema';
	import AccessLevelPermissionsInfo from '$lib/components/non-generic/info/AccessLevelPermissionsInfo.svelte';

	export let accessLevel: AccessLevel;
</script>

<span class="block mt-2">Description:</span>

<p class="opacity-90 text-sm line-clamp-4 mb-2">
	{accessLevel.description}
</p>

<hr class="my-4" />

<AccessLevelPermissionsInfo {accessLevel} />
