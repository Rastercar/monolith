<script lang="ts">
	import DrawerHamburgerButton from '$lib/components/button/DrawerHamburgerButton.svelte';
	import AppBarUserMenu from '$lib/components/menu/AppBarUserMenu.svelte';
	import Navigation from '$lib/components/navigation/Navigation.svelte';
	import { AppBar, AppShell, Drawer, LightSwitch } from '@skeletonlabs/skeleton';
</script>

<Drawer>
	<h2 class="p-4">Navigation</h2>
	<hr />
	<Navigation class="mt-4" />
</Drawer>

<AppShell slotSidebarLeft="w-0 lg:w-64">
	<svelte:fragment slot="header">
		<AppBar>
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
		<Navigation class="mt-4" />
	</svelte:fragment>

	<slot />
</AppShell>
