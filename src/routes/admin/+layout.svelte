<script lang="ts">
	import DrawerHamburgerButton from '$lib/components/button/DrawerHamburgerButton.svelte';
	import Navigation from '$lib/components/navigation/Navigation.svelte';
	import { AppBar, AppShell, Drawer, LightSwitch } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	onMount(() => {
		document.body.setAttribute('data-theme', 'rocket');
	});
</script>

<Drawer>
	<h2 class="p-4">Navigation</h2>
	<hr />
	<Navigation />
</Drawer>

<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64">
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<DrawerHamburgerButton />
					<strong class="text-xl uppercase">Admin</strong>
				</div>
			</svelte:fragment>

			<svelte:fragment slot="trail">
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<svelte:fragment slot="sidebarLeft">
		<Navigation />
	</svelte:fragment>

	<slot />
</AppShell>
