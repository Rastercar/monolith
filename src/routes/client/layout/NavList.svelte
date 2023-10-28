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

	const canShowRoute = (route: Route) => {
		if (!route.requiredPermissions) return true;

		// if the route requires permissions but we do not have a user, bail
		if (!user) return false;

		let userPerms = user.accessLevel.permissions;

		return route.requiredPermissions.every((p) => userPerms.includes(p));
	};

	$: ({ user } = $authStore);
</script>

<nav class="list-nav" data-sveltekit-preload-data="off">
	<ul>
		{#each routes as route}
			{#if canShowRoute(route)}
				<li>
					<NavLink
						href={route.href}
						icon={route.icon}
						label={route.label}
						on:click={() => {
							if (route.closeSidebarOnClick) drawerStore.close();
						}}
					/>
				</li>
			{/if}
		{/each}
	</ul>
</nav>
