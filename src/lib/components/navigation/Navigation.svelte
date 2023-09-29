<script lang="ts">
	import { page } from '$app/stores';
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	let clazz: string = '';
	export { clazz as class };

	const drawerStore = getDrawerStore();
	const closeDrawer = () => drawerStore.close();

	const routes = [
		{ href: '/', label: 'Home' },
		{ href: '/client', label: 'Client' },
		{ href: '/auth/sign-in', label: 'Sign in' },
		{ href: '/auth/sign-up', label: 'Sign up' },
		{ href: '/auth/sign-out', label: 'Sign out' },
		{ href: '/auth/recover-password', label: 'Recover Password' }
	];

	$page.url.pathname;
</script>

<nav class={`list-nav ${clazz || ''}`} data-sveltekit-preload-data="off">
	<ul>
		{#each routes as { href, label }}
			<li>
				<a
					{href}
					class:bg-surface-200-700-token={$page.url.pathname === href}
					on:click={closeDrawer}
				>
					{label}
				</a>
			</li>
		{/each}
	</ul>
</nav>
