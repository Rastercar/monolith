<script lang="ts">
	import { getMapContext } from '$lib/store/map.svelte';
	import Icon from '@iconify/svelte';
	import MapControl from './MapControl.svelte';

	const mapContext = getMapContext();

	const openSelectTrackersDrawer = () => {
		// TODO:
		// const drawerSettings: DrawerSettings = {
		// 	position: 'bottom',
		// 	height: 'h-[500px] md:h-[600px]',
		// 	meta: { component: SelectTrackerOverlay }
		// };
		// drawerStore.open(drawerSettings);
	};

	const fitMapToTrackersBeingShown = () => {
		const bounds = mapContext.getTrackersMapBounds();
		if (!bounds.isEmpty()) mapContext.getGoogleMap()?.fitBounds(bounds);
	};
</script>

<MapControl position={window.google.maps.ControlPosition.TOP_RIGHT}>
	<button
		onclick={openSelectTrackersDrawer}
		class="m-[10px] h-[60px] flex flex-col px-4 shadow-lg text-black bg-white hover:bg-surface-50 rounded-sm border border-surface-300"
	>
		<div class="my-auto">
			<div class="flex items-center type-scale-3">
				<Icon icon="mdi:car" class="mr-1" /> Trackers
			</div>

			<div class="mt-[4px]">{Object.keys(mapContext.mapSelectedTrackers).length} selected</div>
		</div>
	</button>
</MapControl>

<MapControl position={window.google.maps.ControlPosition.TOP_LEFT}>
	<button
		onclick={fitMapToTrackersBeingShown}
		class="m-[10px] h-[40px] flex items-center px-4 shadow-lg text-black bg-white hover:bg-surface-50 rounded-sm border border-surface-300"
	>
		<div class="flex items-center text-lg">
			<Icon icon="mdi:image-filter-center-focus" class="mr-1" /> center
		</div>
	</button>
</MapControl>
