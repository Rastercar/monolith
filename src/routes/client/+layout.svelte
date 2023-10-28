<script lang="ts">
	import { page } from '$app/stores';
	import { AppBar, AppShell, LightSwitch } from '@skeletonlabs/skeleton';
	import AppBarUserMenu from './layout/AppBarUserMenu.svelte';
	import DrawerHamburgerButton from './layout/DrawerHamburgerButton.svelte';
	import MobileNavigationDrawer from './layout/MobileNavigationDrawer.svelte';
	import SidebarNavigation from './layout/SidebarNavigation.svelte';
	import UserDisplay from './layout/UserDisplay.svelte';

	$: isInSettingsRoute = $page.url.pathname.includes('/settings');
</script>

<MobileNavigationDrawer />

<AppShell slotSidebarLeft="bg-surface-100-800-token w-0 lg:w-64">
	<svelte:fragment slot="header">
		<AppBar background="bg-surface-200-700-token">
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<DrawerHamburgerButton />
					<strong class="text-xl uppercase hidden md:block">Rastercar</strong>
				</div>
			</svelte:fragment>

			<svelte:fragment slot="trail">
				<LightSwitch />

				<AppBarUserMenu />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<svelte:fragment slot="sidebarLeft">
		<div class:hidden={isInSettingsRoute}>
			<UserDisplay class="px-4 pt-4" />
		</div>

		<SidebarNavigation />
	</svelte:fragment>

	<slot />
</AppShell>
