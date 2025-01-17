<script lang="ts">
	import { dev } from '$app/environment';
	import type { Tracker } from '$lib/api/tracker.schema';
	import { apiGetTrackersLastPositions } from '$lib/api/tracking';
	import { SOCKET_IO_TRACKING_NAMESPACE } from '$lib/constants/socket-io';
	import { env } from '$lib/env/public-env';
	import { getMapContext, setMapContext, type Position } from '$lib/store/map.svelte';
	import { loadMapLibraries } from '$lib/utils/google-maps';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { onDestroy, onMount } from 'svelte';
	import { createWsConnectionToTrackingNamespace as createSocketIoConnection } from '../map';
	import ConnectionFailedAlert from './ConnectionFailedAlert.svelte';
	import SelectedTrackerOverlay from './SelectedTrackerOverlay.svelte';
	import TrackerMarker from './TrackerMarker.svelte';
	import TrackersMapControls from './TrackersMapControls.svelte';

	setMapContext();

	const mapContext = getMapContext();

	/**
	 * if SocketIO is connecting or reconnecting to the server
	 */
	let isConnecting = $state(true);

	/**
	 * if the initial connection has failed and a warning
	 * should be displayed
	 */
	let showConnectionErrorAlert = $state(false);

	/**
	 * if the map libraries have been loaded and the map should be displayed
	 */
	let mapIsLoaded = $state(false);

	let trackerModalIsOpen = $state(false);

	let trackerToDisplay = $state<Tracker | null>(null);
	let trackerToDisplayPosition = $state<Position | null>(null);

	/**
	 * Timer for deboucing changed tracker selection
	 */
	let trackerSelectionDebounceTimer: ReturnType<typeof setTimeout>;

	/**
	 * The trackers currently selected to be shown on the map
	 */
	let selectedTrackers: number[] = [];

	/**
	 * SocketIO connection for realtime tracker position updates
	 */
	const socket = createSocketIoConnection(
		`${window.location.origin}/${SOCKET_IO_TRACKING_NAMESPACE}`
	);

	socket.on('connect', () => {
		isConnecting = true;
		showConnectionErrorAlert = false;
	});

	socket.on('error', (error) => {
		if (dev) console.warn('[ws error]', error);
	});

	socket.on('connect_error', () => {
		isConnecting = false;
		showConnectionErrorAlert = true;
	});

	socket.on('disconnect', () => {
		// if socket.active then its a temporary disconnection, the socket will automatically try to
		// reconnect else the connection was forcefully closed by the server or the client itself
		// in that case, `socket.connect()` must be manually called in order to reconnect
		isConnecting = socket.active;
	});

	socket.on('position', ({ trackerId, ...position }) => {
		mapContext.trackerPositionCache[trackerId] = position;
	});

	// TODO: read the search param 'lookupTracker' and init the map context with only it as the only selected tracker

	const initMap = async () => {
		await loadMapLibraries();

		const mapElement = document.getElementById('map') as HTMLDivElement;
		if (!mapElement) throw new Error('failed to get map element');

		mapContext.mapElement = mapElement;

		const cachedPositionsBounds = mapContext.getTrackersMapBounds();

		const defaultCenter = { lat: -20.397, lng: -54.644 };

		const center = !cachedPositionsBounds.isEmpty()
			? cachedPositionsBounds.getCenter()
			: defaultCenter;

		mapContext.mapInstance = new window.google.maps.Map(mapElement, {
			center,
			zoom: 15,

			// for now we dont allow the fullscreen mode because it uses the browser
			// fullscreen API where all elements that are not children on the map div
			// are not shown, this is a problem for the select tracker overlay
			fullscreenControl: false,

			mapId: env.PUBLIC_GOOGLE_MAPS_MAP_ID
		});

		if (!cachedPositionsBounds.isEmpty()) mapContext.mapInstance.fitBounds(cachedPositionsBounds);
	};

	onMount(async () => {
		await initMap();
		mapIsLoaded = true;
	});

	onDestroy(() => {
		mapContext.mapElement = undefined;
		mapContext.mapInstance = undefined;

		if (trackerSelectionDebounceTimer) clearTimeout(trackerSelectionDebounceTimer);
		socket.disconnect();
	});

	// emit a SocketIO message to the rastercar API, informing the trackers we want
	// to recieve positions of, whenever the tracker selection changed
	$effect(() => {
		let newTrackerIds = Object.keys(mapContext.mapSelectedTrackers)
			.map((v) => parseInt(v))
			.filter((n) => !Number.isNaN(n));

		// debounce the selection to avoid sending messages to the API on
		// quick selection changes such as toggling a checkbox rapidly
		if (trackerSelectionDebounceTimer) clearTimeout(trackerSelectionDebounceTimer);

		trackerSelectionDebounceTimer = setTimeout(() => {
			if (!socket) return;

			const trackerSelectionChanged =
				selectedTrackers.length !== newTrackerIds.length ||
				!newTrackerIds.every((id) => selectedTrackers.includes(id));

			// if the ids of the trackers did not change (theyre the same but just)
			// in a different order, dont bother sending the message
			if (!trackerSelectionChanged) return;

			selectedTrackers = newTrackerIds;

			socket.emit('changeTrackersToListen', newTrackerIds);

			// now that we updated the trackers to see on the map, simply changing the trackers to listen
			// is not enough, as a position would only be shown when the tracker comunicates with the platform
			// again, so we need to fetch the last positions of all of them manually
			apiGetTrackersLastPositions(newTrackerIds).then((trackersLastPositions) => {
				trackersLastPositions.forEach(({ trackerId, ...position }) => {
					mapContext.trackerPositionCache[trackerId] = position;
				});

				// if the map is not loaded dont calculate the bounds
				// (this might happen on very rare cases the request responds faster than the google maps lib is loaded)
				if (!mapIsLoaded) return;

				const newBounds = mapContext.getTrackersMapBounds();

				if (!newBounds.isEmpty() && mapContext.mapInstance) {
					mapContext.mapInstance.fitBounds(newBounds);
				}
			});
		});
	});
</script>

{#if showConnectionErrorAlert}
	<ConnectionFailedAlert
		isConnectingToApi={isConnecting}
		onReconnectClick={() => {
			isConnecting = true;
			socket.connect();
		}}
		onCloseClick={() => (showConnectionErrorAlert = false)}
	/>
{/if}

<div id="map" class="h-full w-full">
	{#if mapIsLoaded}
		<TrackersMapControls />

		{#each Object.values(mapContext.mapSelectedTrackers) as tracker}
			{@const position = mapContext.trackerPositionCache[tracker.id]}

			{#if position}
				<TrackerMarker
					{position}
					{tracker}
					onClick={() => {
						trackerModalIsOpen = true;
						trackerToDisplay = tracker;
						trackerToDisplayPosition = position;
					}}
				/>
			{/if}
		{/each}
	{/if}
</div>

<Modal
	bind:open={trackerModalIsOpen}
	contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl w-[400px] h-screen"
	positionerJustify="justify-end"
	positionerPadding=""
	positionerAlign=""
	transitionsPositionerIn={{ x: 480, duration: 200 }}
	transitionsPositionerOut={{ x: 480, duration: 200 }}
>
	{#snippet content()}
		{#if trackerToDisplay && trackerToDisplayPosition}
			<SelectedTrackerOverlay
				tracker={trackerToDisplay}
				position={trackerToDisplayPosition}
				onCloseClick={() => (trackerModalIsOpen = false)}
			/>
		{/if}
	{/snippet}
</Modal>
