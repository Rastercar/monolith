<script lang="ts">
	import { onDestroy, onMount, setContext } from 'svelte';
	import { loadMapLibraries } from '$lib/utils/google-maps';
	import {
		MAP_CONTEXT_KEY,
		selectedTrackerStore,
		type MapContext,
		createWsConnectionToTrackingNamespace,
		trackerPositionStore
	} from '../map';
	import { apiGetJwtForCurrentUser } from '$lib/api/user';
	import SelectTrackersMapControl from './SelectTrackersMapControl.svelte';
	import { getToaster } from '$lib/store/toaster';
	import TrackerMarker from './TrackerMarker.svelte';

	let mapElement: HTMLDivElement;

	let googleMap: InstanceType<typeof window.google.maps.Map>;

	let socket: ReturnType<typeof createWsConnectionToTrackingNamespace> | null = null;

	let timer: ReturnType<typeof setTimeout>;

	let interval: ReturnType<typeof setInterval>;

	let oldSelectedTrackers: number[] = [];

	setContext<MapContext>(MAP_CONTEXT_KEY, {
		getGoogleMap: () => googleMap,
		getMapElement: () => mapElement
	});

	const toaster = getToaster();

	const initMap = async () => {
		await loadMapLibraries();

		mapElement = document.getElementById('map') as HTMLDivElement;

		if (!mapElement) {
			console.error('failed to find map element');
			return;
		}

		const defaultCenter = { lat: -20.397, lng: -54.644 };
		const center = Object.values($trackerPositionStore)[0] ?? defaultCenter;

		googleMap = new window.google.maps.Map(mapElement, {
			center,
			zoom: 16,
			// [TODO-PROD] do not use a demo map id in prod
			mapId: 'DEMO_MAP_ID'
		});
	};

	// Emit a SocketIO message to the rastercar API, informing the trackers we want
	// to recieve positions of, whenever the tracker selection changed
	const unsubscribe = selectedTrackerStore.subscribe((v) => {
		let newTrackerIds = Object.keys(v)
			.map((v) => parseInt(v))
			.filter((n) => !Number.isNaN(n));

		// Debounce the selection to avoid sending messages to the API on
		// quick selection changes such as toggling a checkbox rapidly
		if (timer) clearTimeout(timer);

		timer = setTimeout(() => {
			if (!socket) return;

			const trackerSelectionChanged =
				oldSelectedTrackers.length !== newTrackerIds.length ||
				!newTrackerIds.every((id) => oldSelectedTrackers.includes(id));

			// If the ids of the trackers did not change (theyre the same but just)
			// in a different order, dont bother sending the message
			if (!trackerSelectionChanged) return;

			oldSelectedTrackers = newTrackerIds;
			socket.emit('change_trackers_to_listen', newTrackerIds);
		}, 500);
	});

	onMount(async () => {
		initMap();

		const token = await apiGetJwtForCurrentUser().catch((e) => {
			// TODO:
			// add something to the map overlay and a retry button
			toaster.error('internal error loading tracker data');
			throw e;
		});

		socket = createWsConnectionToTrackingNamespace(token);

		socket.on('position', ({ trackerId, lat, lng }) => {
			$trackerPositionStore[trackerId] = { lat, lng };
		});

		// TODO: proper error handling
		socket.on('error', (error) => {
			console.warn(error);
		});
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
		if (timer) clearInterval(interval);

		unsubscribe();

		if (socket) {
			socket.disconnect();
			socket = null;
		}
	});
</script>

<div id="map" class="h-full w-full">
	{#if googleMap}
		<SelectTrackersMapControl />

		{#each Object.values($selectedTrackerStore) as tracker}
			{@const position = $trackerPositionStore[tracker.id]}

			{#if position}
				<TrackerMarker {position} />
			{/if}
		{/each}
	{/if}
</div>
