<script lang="ts">
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import type { PropsWithChildren } from '$lib/utils/svelte';

	let { children }: PropsWithChildren = $props();
</script>

<!-- TODO: this can probably be removed in favor of route meta -->
<PermissionGuard requiredPermissions={['UPDATE_ORGANIZATION']}>
	{@render children()}
</PermissionGuard>
