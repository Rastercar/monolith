<script lang="ts" module>
	import { page } from '$app/stores';
	import type { KIT_ROUTES } from '$lib/ROUTES';

	export type Route = {
		href: keyof KIT_ROUTES['PAGES'];
		icon: string;
		label: string;
		closeSidebarOnClick?: boolean;
		requiredPermissions?: apiPermission[];
	};
</script>

<script lang="ts">
	import type { apiPermission } from '$lib/constants/permissions';
	import { getAuthContext } from '$lib/store/auth.svelte';
	import NavLink from './NavLink.svelte';

	interface Props {
		routes: Route[];
	}

	const auth = getAuthContext();

	let { routes }: Props = $props();
</script>

<nav>
	<ul>
		{#each routes as r}
			{#if !r.requiredPermissions || auth.hasPermission(r.requiredPermissions)}
				<li
					class="hover:bg-primary-300-700"
					class:bg-primary-200-800={r.href === $page.url.pathname}
				>
					<NavLink
						href={r.href}
						icon={r.icon}
						label={r.label}
						onclick={() => r.closeSidebarOnClick && console.log('TODO: close sidebar')}
					/>
				</li>
			{/if}
		{/each}
	</ul>
</nav>
