<script lang="ts">
	import { page } from '$app/stores';
	import { layoutStore } from '$lib/store/layout';
	import { AppBar, AppShell, LightSwitch } from '@skeletonlabs/skeleton';
	import AppBarUserMenu from './layout/AppBarUserMenu.svelte';
	import ApplicationDrawer from './layout/ApplicationDrawer.svelte';
	import DrawerHamburgerButton from './layout/DrawerHamburgerButton.svelte';
	import SidebarNavigation from './layout/SidebarNavigation.svelte';
	import UserDisplay from './layout/UserDisplay.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let isInSettingsRoute = $derived($page.url.pathname.includes('/settings'));
</script>

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
</AppShell>
