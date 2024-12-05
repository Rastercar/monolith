<script lang="ts">
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import type { permission } from '$lib/constants/permissions';
	import Icon from '@iconify/svelte';

	interface Props {
		text: string;
		href: string;
		requiredPermissions: permission;
	}

	let { text, href, requiredPermissions }: Props = $props();
</script>

<PermissionGuard {requiredPermissions}>
	<a {href}>
		<button class="btn preset-filled-primary-500">
			<Icon icon="mdi:plus" />
			{text}
		</button>
	</a>
</PermissionGuard>
