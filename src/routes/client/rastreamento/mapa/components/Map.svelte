<script lang="ts">
	import { env } from '$lib/env/public-env';
	import { getMapContext } from '$lib/store/context';
	import { loadMapLibraries } from '$lib/utils/google-maps';
	import { onDestroy, onMount } from 'svelte';
	import RealTimeMapView from './views/realTime/RealTimeMapView.svelte';
	import ConnectionFailedAlert from './views/realTime/ConnectionFailedAlert.svelte';

	const ctx = getMapContext();

	/**
	 * if the map libraries have been loaded and the map should be displayed
	 */
	let mapLoaded = $state(false);

	const initMap = async () => {
		await loadMapLibraries();

		const mapElement = document.getElementById('map') as HTMLDivElement;
		if (!mapElement) throw new Error('failed to get map element');

		ctx.mapElement = mapElement;

		// [PROD-TODO]: find a more suitable map center somehow
		const defaultCenter = { lat: -20.397, lng: -54.644 };

		ctx.mapInstance = new window.google.maps.Map(mapElement, {
			center: defaultCenter,
			zoom: 15,

			// for now we dont allow the fullscreen mode because it uses the browser
			// fullscreen API where all elements that are not children on the map div
			// are not shown, this is a problem for the select tracker overlay
			fullscreenControl: false,

			mapId: env.PUBLIC_GOOGLE_MAPS_MAP_ID
		});
	};

	onMount(async () => {
		await initMap();
		mapLoaded = true;
	});

	onDestroy(() => {
		ctx.mapElement = undefined;
		ctx.mapInstance = undefined;

		// we disconnect the socket here instead of on the RealTimeMapView because
		// we want to keep the connection alive when the user toggles between views
		if (ctx.realTimeMapViewState.socket) {
			ctx.realTimeMapViewState.socket.disconnect();
			ctx.realTimeMapViewState.socket = null;
		}
	});
</script>

<!-- TODO: ao clicar em "ver historico de posições" de um rastreador, alterar a mapView de acordo  -->
<button
	class="btn"
	onclick={() => (ctx.mapView = ctx.mapView === 'real-time' ? 'tracker-history' : 'real-time')}
>
	{ctx.mapView}
</button>

{#if ctx.realTimeMapViewState.showConnectionErrorAlert}
	<ConnectionFailedAlert
		isConnectingToApi={ctx.realTimeMapViewState.isConnecting}
		onReconnectClick={() => {
			ctx.realTimeMapViewState.isConnecting = true;
			ctx.realTimeMapViewState.socket?.connect();
		}}
		onCloseClick={() => (ctx.realTimeMapViewState.showConnectionErrorAlert = false)}
	/>
{/if}

<div id="map" class="h-full w-full">
	{#if mapLoaded}
		{#if ctx.mapView === 'real-time'}
			<RealTimeMapView />
		{:else}
			<!-- TODO: tracker history view  -->
			<div></div>
		{/if}
	{/if}
</div>
