<script>
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<PermissionGuard requiredPermissions={['UPDATE_ORGANIZATION']}>
	{@render children?.()}
</PermissionGuard>
