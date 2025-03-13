<script lang="ts">
	import { apiGetTrackersLastPositions } from '$lib/api/tracking';
	import { getMapContext } from '$lib/store/context';
	import { onDestroy, onMount } from 'svelte';
	import TrackerMarker from './elements/TrackerMarker.svelte';
	import TrackersMapControls from './RealTimeMapControls.svelte';
	import { createWsConnectionToTrackingNamespace as createSocketIoConnection } from '../../../map';
	import { SOCKET_IO_TRACKING_NAMESPACE } from '$lib/constants/socket-io';
	import { dev } from '$app/environment';
	import ConnectionFailedAlert from './ConnectionFailedAlert.svelte';

	const ctx = getMapContext();

	/**
	 * Timer for deboucing changed tracker selection
	 */
	let trackerSelectionDebounceTimer: ReturnType<typeof setTimeout>;

	/**
	 * The trackers currently selected to be shown on the map
	 *
	 * altough we use the map context to store the selected trackers, this is not
	 * duplicate state as this is used to differentiate a new selection from a old selection
	 */
	let selectedTrackers: number[] = [];

	const initSocket = () => {
		/**
		 * SocketIO connection for realtime tracker position updates
		 */
		ctx.realTimeMapViewState.socket = createSocketIoConnection(
			`${window.location.origin}/${SOCKET_IO_TRACKING_NAMESPACE}`
		);

		ctx.realTimeMapViewState.socket.on('connect', () => {
			ctx.realTimeMapViewState.isConnecting = true;
			ctx.realTimeMapViewState.showConnectionErrorAlert = false;
		});

		ctx.realTimeMapViewState.socket.on('error', (error) => {
			if (dev) console.warn('[ws error]', error);
		});

		ctx.realTimeMapViewState.socket.on('connect_error', () => {
			ctx.realTimeMapViewState.isConnecting = false;
			ctx.realTimeMapViewState.showConnectionErrorAlert = true;
		});

		ctx.realTimeMapViewState.socket.on('disconnect', () => {
			// if socket.active then its a temporary disconnection, the socket will automatically try to
			// reconnect else the connection was forcefully closed by the server or the client itself
			// in that case, `socket.connect()` must be manually called in order to reconnect
			ctx.realTimeMapViewState.isConnecting = ctx.realTimeMapViewState.socket?.active ?? false;
		});

		ctx.realTimeMapViewState.socket.on('position', ({ trackerId, ...position }) => {
			ctx.realTimeMapViewState.trackerPositionCache[trackerId] = position;
		});
	};

	onMount(() => {
		const cachedPositionsBounds = ctx.getTrackersMapBounds();

		// if this is the first time rendering this map view, meaning
		// the socket connection was not initialized, then init it
		if (!ctx.realTimeMapViewState.socket) initSocket();

		if (ctx.mapInstance && !cachedPositionsBounds.isEmpty()) {
			ctx.mapInstance.setCenter(cachedPositionsBounds.getCenter());
			ctx.mapInstance.fitBounds(cachedPositionsBounds);
		}
	});

	onDestroy(() => {
		if (trackerSelectionDebounceTimer) clearTimeout(trackerSelectionDebounceTimer);
	});

	// emit a SocketIO message to the rastercar API, informing the trackers we want
	// to recieve positions of, whenever the tracker selection changed
	$effect(() => {
		let newTrackerIds = Object.keys(ctx.realTimeMapViewState.selectedTrackers)
			.map((v) => parseInt(v))
			.filter((n) => !Number.isNaN(n));

		// debounce the selection to avoid sending messages to the API on
		// quick selection changes such as toggling a checkbox rapidly
		if (trackerSelectionDebounceTimer) clearTimeout(trackerSelectionDebounceTimer);

		trackerSelectionDebounceTimer = setTimeout(() => {
			if (!ctx.realTimeMapViewState.socket) return;

			const trackerSelectionChanged =
				selectedTrackers.length !== newTrackerIds.length ||
				!newTrackerIds.every((id) => selectedTrackers.includes(id));

			// if the ids of the trackers did not change (theyre the same but just)
			// in a different order, dont bother sending the message
			if (!trackerSelectionChanged) return;

			selectedTrackers = newTrackerIds;

			ctx.realTimeMapViewState.socket.emit('changeTrackersToListen', newTrackerIds);

			// now that we updated the trackers to see on the map, simply changing the trackers to listen
			// is not enough, as a position would only be shown when the tracker comunicates with the platform
			// again, so we need to fetch the last positions of all of them manually
			apiGetTrackersLastPositions(newTrackerIds).then((trackersLastPositions) => {
				trackersLastPositions.forEach(({ trackerId, ...position }) => {
					ctx.realTimeMapViewState.trackerPositionCache[trackerId] = position;
				});

				const newBounds = ctx.getTrackersMapBounds();

				if (!newBounds.isEmpty() && ctx.mapInstance) {
					ctx.mapInstance.fitBounds(newBounds);
				}
			});
		});
	});
</script>

<!--
@component

A map view that shows the selected trackers in real time
-->
<TrackersMapControls />

{#each Object.values(ctx.realTimeMapViewState.selectedTrackers) as tracker}
	{@const position = ctx.realTimeMapViewState.trackerPositionCache[tracker.id]}

	{#if position}
		<TrackerMarker
			{position}
			onClick={() => ctx.showRealtimeViewSelectedTrackerOverlay(tracker, position)}
		/>
	{/if}
{/each}
