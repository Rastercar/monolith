<script lang="ts">
	import DrawerHamburgerButton from '$lib/components/button/DrawerHamburgerButton.svelte';
	import AppBarUserMenu from '$lib/components/menu/AppBarUserMenu.svelte';
	import { AppBar, AppShell, LightSwitch } from '@skeletonlabs/skeleton';
	import MobileNavigationDrawer from './layout/MobileNavigationDrawer.svelte';
	import SidebarNavigation from './layout/SidebarNavigation.svelte';
</script>

<!-- Mobile drawer -->
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
		<SidebarNavigation class="mt-4" />
	</svelte:fragment>

	<slot />
</AppShell>
