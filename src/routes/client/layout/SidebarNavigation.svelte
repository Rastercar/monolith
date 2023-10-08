<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	let clazz: string = '';
	export { clazz as class };

	const drawerStore = getDrawerStore();

	interface Route {
		href: string;
		icon: string;
		label: string;
	}

	const routes: Route[] = [
		{ href: '/client', label: 'home', icon: 'mdi:home' },
		{ href: '/client/my-profile', label: 'my profile', icon: 'mdi:account' }
	];
</script>

<nav class={`list-nav ${clazz || ''}`} data-sveltekit-preload-data="off">
	<ul>
		{#each routes as { href, label, icon }}
			<li>
				<a
					{href}
					class:bg-surface-200-700-token={$page.url.pathname === href}
					on:click={() => drawerStore.close()}
				>
					<Icon {icon} class="mr-2" />
					{label}
				</a>
			</li>
		{/each}
	</ul>
</nav>
