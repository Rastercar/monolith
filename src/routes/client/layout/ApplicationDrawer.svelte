<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	import SidebarNavigation from './SidebarNavigation.svelte';
	import UserDisplay from './UserDisplay.svelte';

	const drawerStore = getDrawerStore();
</script>

<Drawer>
	{#if $drawerStore.meta?.component}
		<svelte:component this={$drawerStore.meta.component} {...$drawerStore.meta.props} />
	{:else}
		<div class="p-4 flex justify-between space-x-2 items-center">
			<UserDisplay />

			<button class="btn btn-icon btn-icon-sm" on:click={() => drawerStore.close()}>
				<Icon icon="mdi:close" height="24" />
			</button>
		</div>

		<hr />

		<SidebarNavigation />
	{/if}
</Drawer>
