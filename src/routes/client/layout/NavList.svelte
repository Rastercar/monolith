<script lang="ts" module>
	import { page } from '$app/state';
	import type { KIT_ROUTES } from '$lib/ROUTES';
	import { routesMeta } from '$lib/routes-meta';

	export type Route = {
		href: keyof KIT_ROUTES['PAGES'];
		icon: string;
		label: string;
	};
</script>

<script lang="ts">
	import { getAuthContext } from '$lib/store/context';
	import NavLink from './NavLink.svelte';

	interface Props {
		routes: Route[];
		classes?: string;
		onRouteClick?: VoidFunction;
	}

	const auth = getAuthContext();

	let { routes, classes, onRouteClick }: Props = $props();
</script>

<nav class={classes}>
	<ul>
		{#each routes as r}
			{@const meta = routesMeta[r.href]}
			{@const requiredPerms = meta.requiredAuth === 'logged-in' ? meta.requiredPermissions : []}

			{#if !requiredPerms || auth.hasPermission(requiredPerms)}
				<li
					class="hover:bg-primary-300-700"
					class:bg-primary-200-800={r.href === page.url.pathname}
				>
					<NavLink href={r.href} icon={r.icon} label={r.label} onclick={onRouteClick} />
				</li>
			{/if}
		{/each}
	</ul>
</nav>
