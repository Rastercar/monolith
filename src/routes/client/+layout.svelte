<script lang="ts">
	import { page } from '$app/stores';
	import { getAuthContext } from '$lib/store/auth.svelte';
	import AppBarUserMenu from './layout/AppBarUserMenu.svelte';
	import ApplicationDrawer from './layout/ApplicationDrawer.svelte';
	import DarkModeSwitch from './layout/DarkModeSwitch.svelte';
	import DrawerHamburgerButton from './layout/DrawerHamburgerButton.svelte';
	import SidebarNavigation from './layout/SidebarNavigation.svelte';
	import ThemeSelector from './layout/ThemeSelector.svelte';
	import UserDisplay from './layout/UserDisplay.svelte';

	let { children, data } = $props();

	let { headerVisibility = true, sidebarVisibility = true } = data.routeMeta;

	let isInSettingsRoute = $derived($page.url.pathname.includes('/settings'));

	const auth = getAuthContext();

	auth.setUser(data.user);
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
				<span class="type-scale-5 hidden lg:block">Dashboard</span>

				<DarkModeSwitch classes="ml-auto" />
				<ThemeSelector extraClasses="max-w-48 mx-4" />
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
