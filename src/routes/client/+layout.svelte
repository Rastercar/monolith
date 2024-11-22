<script lang="ts">
	import { authStore } from '$lib/store/auth';
	import { onMount } from 'svelte';
	import AppBarUserMenu from './layout/AppBarUserMenu.svelte';
	import ApplicationDrawer from './layout/ApplicationDrawer.svelte';
	import DrawerHamburgerButton from './layout/DrawerHamburgerButton.svelte';

	let { children, data } = $props();

	onMount(() => {
		if (data.user) authStore.setUser(data.user);
	});

	let { headerVisibility, sidebarVisibility } = data.routeMeta;

	// TODO:
	// let isInSettingsRoute = $derived($page.url.pathname.includes('/settings'));
</script>

<div
	class:grid-rows-[1fr]={!headerVisibility}
	class:grid-rows-[auto_1fr]={headerVisibility}
	class="grid h-screen"
>
	<ApplicationDrawer open={true} />

	<!-- Header -->
	{#if headerVisibility}
		<header class="bg-surface-200-800 p-4">
			<div class="flex items-center">
				<DrawerHamburgerButton />
				<strong class="text-xl uppercase hidden md:block">Rastercar</strong>

				<AppBarUserMenu />
			</div>
		</header>
	{/if}

	<div
		class:md:grid-cols-[1fr]={!sidebarVisibility}
		class:md:grid-cols-[auto_1fr]={sidebarVisibility}
		class="grid grid-cols-1"
	>
		{#if sidebarVisibility}
			<aside class="hidden md:block bg-surface-300-700 p-4">(sidebar)</aside>
		{/if}

		<main>
			{@render children()}
		</main>
	</div>
</div>
