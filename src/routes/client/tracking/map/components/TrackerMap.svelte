<script lang="ts">
	import { apiGetTrackersLastPositions } from '$lib/api/tracking';
	import { getMapContext, setMapContext } from '$lib/store/map.svelte';
	import { showErrorToast, showSuccessToast } from '$lib/store/toast';
	import { loadMapLibraries } from '$lib/utils/google-maps';
	import { onDestroy, onMount } from 'svelte';
	import { createWsConnectionToTrackingNamespace } from '../map';
	import TrackerMarker from './TrackerMarker.svelte';
	import TrackersMapControls from './TrackersMapControls.svelte';

	setMapContext();

	const mapContext = getMapContext();

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
	 *
	 * TODO: isnt this duplicate state ?
	 */
	let selectedTrackers: number[] = [];

	let isConnectingToApi = $state(false);

	let showConnectionErrorAlert = $state(false);

	const initMap = async () => {
		await loadMapLibraries();

		const mapElement = document.getElementById('map') as HTMLDivElement;
		if (!mapElement) throw new Error('failed to get map element');

		mapContext.mapElement = mapElement;

		const cachedPositionsBounds = mapContext.getTrackersMapBounds();

		const defaultCenter = { lat: -20.397, lng: -54.644 };

		const center = cachedPositionsBounds.isEmpty()
			? cachedPositionsBounds.getCenter()
			: defaultCenter;

		mapContext.mapInstance = new window.google.maps.Map(mapElement, {
			center,
			zoom: 20,

			// for now we dont allow the fullscreen mode because it uses the browser
			// fullscreen API where all elements that are not children on the map div
			// are not shown, this is a problem for the select tracker overlay
			fullscreenControl: false,

			// [TODO-PROD] do not use a demo map id in prod
			mapId: 'DEMO_MAP_ID'
		});

		if (!cachedPositionsBounds.isEmpty()) mapContext.mapInstance.fitBounds(cachedPositionsBounds);
	};

	let showMap = $state(false);

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

			socket.emit('change_trackers_to_listen', newTrackerIds);

			// now that we updated the trackers to see on the map, simply changing the trackers to listen
			// is not enough, as a position would only be shown when the tracker comunicates with the platform
			// again, so we need to fetch the last positions of all of them manually
			apiGetTrackersLastPositions(newTrackerIds).then((trackersLastPositions) => {
				trackersLastPositions.forEach(({ trackerId, ...position }) => {
					mapContext.trackerPositionCache[trackerId] = position;
				});
			});
		});
	});

	const createWsConnectionToApi = async () => {
		const connect = async () => {
			socket = createWsConnectionToTrackingNamespace();

			console.log('registering callbacks !');

			socket.on('eventFromServer', () => {
				console.log('got event from server');
			});

			socket.on('position', ({ trackerId, ...position }) => {
				mapContext.trackerPositionCache[trackerId] = position;
			});

			socket.on('error', console.warn);
		};

		isConnectingToApi = true;

		try {
			await connect();
		} finally {
			isConnectingToApi = false;
		}
	};

	const reconnectWsToApi = () => {
		createWsConnectionToApi()
			.then(() => {
				showSuccessToast('reconnected');
				showConnectionErrorAlert = false;
			})
			.catch(() => {
				showErrorToast('connection error');
			});
	};

	onMount(async () => {
		await initMap();
		await createWsConnectionToApi();

		showMap = true;
	});

	onDestroy(() => {
		mapContext.mapElement = undefined;
		mapContext.mapInstance = undefined;

		if (trackerSelectionDebounceTimer) clearTimeout(trackerSelectionDebounceTimer);

		// TODO: this is getting called on init for some reason
		// if (socket) {
		// 	socket.disconnect();
		// 	socket = null;
		// }
	});
</script>

{#if showConnectionErrorAlert}
	<!-- <ConnectionFailedAlert
		{isConnectingToApi}
		on:reconnect-click={reconnectWsToApi}
		on:close-click={() => (showConnectionErrorAlert = false)}
	/> -->
{/if}

<div id="map" class="h-full w-full">
	{#if showMap}
		<TrackersMapControls />

		<!-- 
			[TODO-PROD] with this approach all trackers are redrawn
			when the selection changes, causing them all to flicker
			
			this is not the end of the world but it can be improved
		-->
		{#each Object.values(mapContext.mapSelectedTrackers) as tracker}
			{@const position = mapContext.trackerPositionCache[tracker.id]}

			{#if position}
				<TrackerMarker
					{position}
					{tracker}
					onClick={() => {
						// TODO:
					}}
				/>
			{/if}
		{/each}
	{/if}
</div>
