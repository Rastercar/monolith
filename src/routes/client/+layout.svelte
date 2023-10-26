<script lang="ts">
	import { AppBar, AppShell, LightSwitch } from '@skeletonlabs/skeleton';
	import AppBarUserMenu from './layout/AppBarUserMenu.svelte';
	import DrawerHamburgerButton from './layout/DrawerHamburgerButton.svelte';
	import MobileNavigationDrawer from './layout/MobileNavigationDrawer.svelte';
	import SidebarNavigation from './layout/SidebarNavigation.svelte';
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
		<SidebarNavigation />
	</svelte:fragment>

	<slot />
</AppShell>
