<script lang="ts" module>
	export type Route = {
		href: string;
		icon: string;
		label: string;
		closeSidebarOnClick?: boolean;
		requiredPermissions?: apiPermission[];
	};
</script>

<script lang="ts">
	import type { apiPermission } from '$lib/constants/permissions';
	import { authStore } from '$lib/store/auth.svelte';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import NavLink from './NavLink.svelte';

	interface Props {
		routes: Route[];
	}

	let { routes }: Props = $props();

	const drawerStore = getDrawerStore();

	let { user } = $derived($authStore);
</script>

<nav class="list-nav">
	<ul>
		{#each routes as r}
			{#if (r.requiredPermissions ?? []).every((p) => user && user.accessLevel.permissions.includes(p))}
				<li>
					<NavLink
						href={r.href}
						icon={r.icon}
						label={r.label}
						on:click={() => r.closeSidebarOnClick && drawerStore.close()}
					/>
				</li>
			{/if}
		{/each}
	</ul>
</nav>
