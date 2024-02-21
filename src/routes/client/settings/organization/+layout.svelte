<script>
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
</script>

<PermissionGuard requiredPermissions={['UPDATE_ORGANIZATION']} showDeniedSlot>
	<slot />
</PermissionGuard>
