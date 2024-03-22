<script lang="ts">
	import MapControl from './MapControl.svelte';
	import Icon from '@iconify/svelte';
	import { getDrawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';
	import SelectVehicleOverlay from './SelectVehicleOverlay.svelte';

	const drawerStore = getDrawerStore();

	const openDrawer = () => {
		const drawerSettings: DrawerSettings = {
			position: 'bottom',
			height: 'h-[500px] md:h-[600px]',
			meta: { component: SelectVehicleOverlay }
		};
		drawerStore.open(drawerSettings);
	};
</script>

<MapControl position={window.google.maps.ControlPosition.TOP_RIGHT}>
	<div class="m-[10px] h-[40px] flex items-center px-4 shadow-lg text-black bg-white rounded-sm">
		<button class="flex items-center text-lg" on:click={openDrawer}>
			<Icon icon={'mdi:car'} class="mr-2" height={20} /> Trackers
		</button>
	</div>
</MapControl>
