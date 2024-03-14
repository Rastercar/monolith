<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { loadGoogleMaps } from '$lib/utils/google-maps';
	import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';
	import TrackerMarker from './TrackerMarker.svelte';
	import MapControl from './MapControl.svelte';
	import Icon from '@iconify/svelte';
	import { getDrawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';
	import SelectVehicleOverlay from './SelectVehicleOverlay.svelte';
	import { MAP_CONTEXT_KEY, type MapContext } from '../map';

	let mapElement: HTMLDivElement;
	let googleMap: InstanceType<typeof window.google.maps.Map>;

	const drawerStore = getDrawerStore();

	const initMap = async () => {
		const mapEl = document.getElementById('map') as HTMLDivElement;

		if (!mapEl) {
			console.error('failed to find map element');
			return;
		}

		mapElement = mapEl;

		googleMap = new window.google.maps.Map(mapElement, {
			center: { lat: -34.397, lng: 150.644 },
			zoom: 8,
			// [TODO-PROD] do not use a demo map id in prod
			mapId: 'DEMO_MAP_ID'
		});
	};

	setContext<MapContext>(MAP_CONTEXT_KEY, {
		getGoogleMap: () => googleMap,
		getMapElement: () => mapElement
	});

	const loadMapLibraries = async () => {
		// Avoid loading twice
		if (window.google?.maps === undefined) {
			loadGoogleMaps({ key: PUBLIC_GOOGLE_MAPS_API_KEY, v: 'weekly' });
		}

		await window.google.maps.importLibrary('maps');
		await window.google.maps.importLibrary('marker');
	};

	const openDrawer = () => {
		const drawerSettings: DrawerSettings = {
			position: 'bottom',
			height: 'h-[600px]',
			meta: { component: SelectVehicleOverlay }
		};
		drawerStore.open(drawerSettings);
	};

	onMount(() => {
		loadMapLibraries().then(initMap);
	});
</script>

<div id="map" class="h-full w-full">
	{#if googleMap}
		<MapControl position={window.google.maps.ControlPosition.TOP_RIGHT}>
			<div class="m-[10px] py-2 px-4 shadow-lg text-black bg-white rounded-sm">
				<button class="flex items-center text-lg" on:click={openDrawer}>
					<Icon icon={'mdi:car'} class="mr-2" height={20} /> Vehicles
				</button>
			</div>
		</MapControl>

		<TrackerMarker position={{ lat: -34.397, lng: 150.644 }} />
	{/if}
</div>
