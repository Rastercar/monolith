<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import NavLink from './NavLink.svelte';

	interface Route {
		href: string;
		icon: string;
		label: string;
		closeSidebarOnClick?: boolean;
	}

	export let routes: Route[];

	const drawerStore = getDrawerStore();
</script>

<nav class="list-nav" data-sveltekit-preload-data="off">
	<ul>
		{#each routes as { href, icon, label, closeSidebarOnClick }}
			<li>
				<NavLink
					{href}
					{icon}
					{label}
					on:click={() => {
						if (closeSidebarOnClick) drawerStore.close();
					}}
				/>
			</li>
		{/each}
	</ul>
</nav>
