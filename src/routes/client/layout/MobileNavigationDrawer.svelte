<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	import SidebarNavigation from './SidebarNavigation.svelte';

	const drawerStore = getDrawerStore();
</script>

<Drawer>
	<h2 class="p-4 flex justify-between items-center">
		Rastercar
		<button class="btn btn-icon btn-icon-sm" on:click={() => drawerStore.close()}>
			<Icon icon="mdi:close" height="24" />
		</button>
	</h2>

	<hr />

	<SidebarNavigation />
</Drawer>
