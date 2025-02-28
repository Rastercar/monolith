<script lang="ts">
	import { env } from '$lib/env/public-env';
	import { route } from '$lib/ROUTES';
	import { isOnMobileViewPort } from '$lib/store/viewport.svelte';
	import { loadMapLibraries } from '$lib/utils/google-maps';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	let mapLoaded = $state(false);
	let seeTrackingMapRef = $state<HTMLDivElement>();

	const initMap = async () => {
		await loadMapLibraries();

		const mapElement = document.getElementById('map') as HTMLDivElement;
		if (!mapElement) throw new Error('failed to get map element');

		const mapInstance = new window.google.maps.Map(mapElement, {
			center: { lat: -20.397, lng: -54.644 },
			zoom: 15,
			mapTypeControl: false,
			streetViewControl: false,

			// for now we dont allow the fullscreen mode because it uses the browser
			// fullscreen API where all elements that are not children on the map div
			// are not shown, this is a problem for the select tracker overlay
			fullscreenControl: false,

			mapId: env.PUBLIC_GOOGLE_MAPS_MAP_ID
		});

		if (!seeTrackingMapRef) throw new Error('invalid seeTrackingMapRef');

		const { isMobileViewport } = isOnMobileViewPort();

		mapInstance.controls[
			isMobileViewport
				? google.maps.ControlPosition.TOP_CENTER
				: google.maps.ControlPosition.TOP_LEFT
		].push(seeTrackingMapRef);
		mapLoaded = true;
	};

	onMount(initMap);
</script>

<div
	class="card preset-filled-surface-100-900 col-span-2 sm:col-span-4 row-span-2 relative min-h-96"
>
	<div id="map" class="h-full w-full card">
		<div
			bind:this={seeTrackingMapRef}
			class="m-3 p-3 bg-white hover:bg-slate-50 text-black rounded border-2 border-surface-300 shadow-lg"
		>
			<a href={route('/client/rastreamento/mapa')} class="flex items-center">
				<Icon icon="mdi:arrow-left" height={20} class="mr-2" />
				<span class="type-scale-2">ir ao mapa de rastreamento</span>
			</a>
		</div>
	</div>
</div>
