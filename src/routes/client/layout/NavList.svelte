<script lang="ts" context="module">
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
	import { authStore } from '$lib/store/auth';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import NavLink from './NavLink.svelte';

	export let routes: Route[];

	const drawerStore = getDrawerStore();

	$: ({ user } = $authStore);
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
