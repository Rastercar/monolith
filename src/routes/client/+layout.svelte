<script lang="ts">
	import { page } from '$app/stores';
	import { getAuthContext } from '$lib/store/auth.svelte';
	import { onMount } from 'svelte';
	import AppBarUserMenu from './layout/AppBarUserMenu.svelte';
	import ApplicationDrawer from './layout/ApplicationDrawer.svelte';
	import DrawerHamburgerButton from './layout/DrawerHamburgerButton.svelte';
	import SidebarNavigation from './layout/SidebarNavigation.svelte';
	import UserDisplay from './layout/UserDisplay.svelte';

	let { children, data } = $props();

	let { headerVisibility, sidebarVisibility } = data.routeMeta;

	let isInSettingsRoute = $derived($page.url.pathname.includes('/settings'));

	onMount(() => getAuthContext().setUser(data.user));
</script>

<div
	class:grid-rows-[1fr]={!headerVisibility}
	class:grid-rows-[auto_1fr]={headerVisibility}
	class="grid h-screen"
>
	<!-- Header -->
	{#if headerVisibility}
		<header class="bg-surface-200-800 p-4">
			<div class="flex items-center">
				<DrawerHamburgerButton />
				<strong class="text-xl uppercase hidden lg:block">Rastercar</strong>

				<AppBarUserMenu />
			</div>
		</header>
	{/if}

	<!-- TODO: fix sidebar -->
	<div
		class:lg:grid-cols-[1fr]={!sidebarVisibility}
		class:lg:grid-cols-[auto_1fr]={sidebarVisibility}
		class="grid grid-cols-1"
	>
		{#if sidebarVisibility}
			<aside class="hidden lg:block bg-surface-100-900 w-72">
				<div class:hidden={isInSettingsRoute}>
					<UserDisplay classes="pl-5 pr-8 py-6" />
				</div>

				<SidebarNavigation />
			</aside>
		{/if}

		<main>
			<ApplicationDrawer />
			{@render children()}
		</main>
	</div>
</div>
