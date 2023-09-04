<script lang="ts">
	import DrawerHamburgerButton from '$lib/components/button/DrawerHamburgerButton.svelte';
	import AppBarUserMenu from '$lib/components/menu/AppBarUserMenu.svelte';
	import Navigation from '$lib/components/navigation/Navigation.svelte';
	import { AppBar, AppShell, Drawer, LightSwitch } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	onMount(() => {
		document.body.setAttribute('data-theme', 'rastercar');
	});
</script>

<Drawer>
	<h2 class="p-4">Navigation</h2>
	<hr />
	<Navigation class="mt-4" />
</Drawer>

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
		<Navigation class="mt-4" />
	</svelte:fragment>

	<slot />
</AppShell>
