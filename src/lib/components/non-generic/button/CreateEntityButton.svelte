<script lang="ts">
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import type { apiPermission } from '$lib/constants/permissions';
	import Icon from '@iconify/svelte';

	interface Props {
		text: string;
		href: string;
		requiredPermission: apiPermission;
	}

	let { text, href, requiredPermission }: Props = $props();
</script>

<PermissionGuard requiredPermissions={[requiredPermission]}>
	<a {href} class="ml-auto">
		<button class="btn variant-filled-primary">
			<Icon icon="mdi:plus" class="mr-1" />
			{text}
		</button>
	</a>
</PermissionGuard>
