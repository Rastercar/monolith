<script lang="ts">
	import { onDestroy, onMount, setContext } from 'svelte';
	import { loadMapLibraries } from '$lib/utils/google-maps';
	import {
		MAP_CONTEXT_KEY,
		selectedTrackerStore,
		type MapContext,
		createWsConnectionToTrackingNamespace,
		trackerPositionStore,
		getTrackersMapBounds
	} from '../map';
	import { apiGetJwtForCurrentUser } from '$lib/api/user';
	import TrackersMapControls from './TrackersMapControls.svelte';
	import TrackerMarker from './TrackerMarker.svelte';
	import { dev } from '$app/environment';
	import { getToaster } from '$lib/store/toaster';
	import ConnectionFailedAlert from './ConnectionFailedAlert.svelte';

	let mapElement: HTMLDivElement;

	let googleMap: InstanceType<typeof window.google.maps.Map>;

	/**
	 * SocketIO connection for realtime tracker position updates
	 */
	let socket: ReturnType<typeof createWsConnectionToTrackingNamespace> | null = null;

	/**
	 * Timer for deboucing changed tracker selection
	 */
	let trackerSelectionDebounceTimer: ReturnType<typeof setTimeout>;

	/**
	 * The trackers currently selected to be shown on the map
	 */
	let selectedTrackers: number[] = [];

	let isConnectingToApi = false;

	let showConnectionErrorAlert = false;

	const toaster = getToaster();

	const initMap = async () => {
		await loadMapLibraries();

		mapElement = document.getElementById('map') as HTMLDivElement;
		if (!mapElement) throw new Error('failed to get map element');

		const cachedPositionsBounds = getTrackersMapBounds();

		const defaultCenter = { lat: -20.397, lng: -54.644 };

		const center = cachedPositionsBounds.isEmpty()
			? cachedPositionsBounds.getCenter()
			: defaultCenter;

		googleMap = new window.google.maps.Map(mapElement, {
			center,
			zoom: 20,

			// for now we dont allow the fullscreen mode
			// because it uses the browser fullscreen API
			// where all elements that are not children on
			// the map div are not shown, this is a problem
			// for the select tracker overlay
			fullscreenControl: false,

			// [TODO-PROD] do not use a demo map id in prod
			mapId: 'DEMO_MAP_ID'
		});

		if (!cachedPositionsBounds.isEmpty()) googleMap.fitBounds(cachedPositionsBounds);
	};

	// Emit a SocketIO message to the rastercar API, informing the trackers we want
	// to recieve positions of, whenever the tracker selection changed
	const unsubscribe = selectedTrackerStore.subscribe((v) => {
		let newTrackerIds = Object.keys(v)
			.map((v) => parseInt(v))
			.filter((n) => !Number.isNaN(n));

		// Debounce the selection to avoid sending messages to the API on
		// quick selection changes such as toggling a checkbox rapidly
		if (trackerSelectionDebounceTimer) clearTimeout(trackerSelectionDebounceTimer);

		trackerSelectionDebounceTimer = setTimeout(() => {
			if (!socket) return;

			const trackerSelectionChanged =
				selectedTrackers.length !== newTrackerIds.length ||
				!newTrackerIds.every((id) => selectedTrackers.includes(id));

			// If the ids of the trackers did not change (theyre the same but just)
			// in a different order, dont bother sending the message
			if (!trackerSelectionChanged) return;

			selectedTrackers = newTrackerIds;
			socket.emit('change_trackers_to_listen', newTrackerIds);
		}, 500);
	});

	setContext<MapContext>(MAP_CONTEXT_KEY, {
		getGoogleMap: () => googleMap,
		getMapElement: () => mapElement
	});

	const createWsConnectionToApi = async () => {
		const connect = async () => {
			const token = await apiGetJwtForCurrentUser().catch((e) => {
				if (dev) console.warn(e);
				showConnectionErrorAlert = true;

				throw e;
			});

			if (typeof token === 'boolean') return;

			socket = createWsConnectionToTrackingNamespace(token);

			socket.on('position', ({ trackerId, ...position }) => {
				$trackerPositionStore[trackerId] = position;
			});

			socket.on('error', (error) => {
				if (dev) console.warn(error);
			});
		};

		isConnectingToApi = true;

		try {
			await connect();
		} finally {
			isConnectingToApi = false;
		}
	};

	onMount(async () => {
		await initMap();
		await createWsConnectionToApi();
	});

	onDestroy(() => {
		if (trackerSelectionDebounceTimer) clearTimeout(trackerSelectionDebounceTimer);

		unsubscribe();

		if (socket) {
			socket.disconnect();
			socket = null;
		}
	});
</script>

{#if showConnectionErrorAlert}
	<ConnectionFailedAlert
		{isConnectingToApi}
		on:reconnect-click={() => {
			createWsConnectionToApi()
				.then(() => {
					toaster.success('reconnected');
					showConnectionErrorAlert = false;
				})
				.catch(() => {
					toaster.error('reconnection failed');
				});
		}}
		on:close-click={() => (showConnectionErrorAlert = false)}
	/>
{/if}

<div id="map" class="h-full w-full">
	{#if googleMap}
		<TrackersMapControls />

		{#each Object.values($selectedTrackerStore) as tracker}
			{@const position = $trackerPositionStore[tracker.id]}

			{#if position}
				<TrackerMarker {position} {tracker} />
			{/if}
		{/each}
	{/if}
</div>
