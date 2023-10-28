<script>
	import PermissionGuard from '$lib/components/guard/permission-guard.svelte';
</script>

<PermissionGuard requiredPermissions={['UPDATE_ORGANIZATION']} showDeniedSlot>
	<slot />
</PermissionGuard>
