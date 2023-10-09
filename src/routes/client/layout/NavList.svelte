<script lang="ts">
	import NavLink from './NavLink.svelte';

	interface Route {
		href: string;
		icon: string;
		label: string;
	}

	export let routes: Route[];
</script>

<nav class="list-nav" data-sveltekit-preload-data="off">
	<ul>
		{#each routes as route}
			<li>
				<NavLink {...route} />
			</li>
		{/each}
	</ul>
</nav>
