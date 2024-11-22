<script lang="ts">
	import { authStore } from '$lib/store/auth.svelte';
	import { onMount } from 'svelte';
	import AppBarUserMenu from './layout/AppBarUserMenu.svelte';
	import DrawerHamburgerButton from './layout/DrawerHamburgerButton.svelte';

	let { children, data } = $props();

	onMount(() => {
		if (data.user) authStore.setUser(data.user);
	});

	// TODO:
	// let isInSettingsRoute = $derived($page.url.pathname.includes('/settings'));
</script>

<div class="grid h-screen grid-rows-[auto_1fr]">
	<!-- Header -->
	<header class="bg-surface-200-800 p-4">
		<div class="flex items-center">
			<DrawerHamburgerButton />
			<strong class="text-xl uppercase hidden md:block">Rastercar</strong>

			<AppBarUserMenu />
		</div>
	</header>

	<div class="grid grid-cols-1 md:grid-cols-[auto_1fr]">
		<aside class="hidden md:block bg-surface-300-700 p-4">(sidebar)</aside>

		<main class="space-y-4 p-4">
			{@render children()}
		</main>
	</div>
</div>

<!-- 
TODO:
<ApplicationDrawer />

<AppShell slotSidebarLeft="bg-surface-100-800-token w-0 lg:w-64">
	{#snippet header()}
		{#if $layoutStore.showHeader}
			<AppBar background="bg-surface-200-700-token">
				{#snippet lead()}
					<div class="flex items-center">
						<DrawerHamburgerButton />
						<strong class="text-xl uppercase hidden md:block">Rastercar</strong>
					</div>
				{/snippet}

				{#snippet trail()}
					<LightSwitch />

					<AppBarUserMenu />
				{/snippet}
			</AppBar>
		{/if}
	{/snippet}

	{#snippet sidebarLeft()}
		<div class:hidden={isInSettingsRoute}>
			<UserDisplay class="px-4 pt-4" />
		</div>

		<SidebarNavigation />
	{/snippet}

	{@render children?.()}
</AppShell> -->
