<script lang="ts">
	import { apiGetTrackerLastLocationQuery } from '$lib/api/tracker.queries';
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import { env } from '$lib/env/public-env';
	import { route } from '$lib/ROUTES';
	import { loadMapLibraries } from '$lib/utils/google-maps';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	interface Props {
		vehicle: Vehicle;
	}

	let { vehicle }: Props = $props();
	let mapHasLoaded = $state(false);

	const hasTrackerToGetLastPosition = !!vehicle.vehicleTracker?.id;

	const query = apiGetTrackerLastLocationQuery(vehicle.vehicleTracker?.id ?? 0, {
		// important wait for the map to load since we
		// create the tracker on the queryFn function
		enabled: hasTrackerToGetLastPosition
	});

	$effect(() => {
		const position = query.data;

		if (window.google?.maps?.marker && map) {
			if (!position) return removeMarker();

			marker ? updateMarkerPosition(position.point) : createMarker(position.point);

			map.setCenter(position.point);
		}
	});

	let map = $state<InstanceType<typeof window.google.maps.Map>>();

	let marker = $state<InstanceType<typeof window.google.maps.marker.AdvancedMarkerElement> | null>(
		null
	);

	const initMap = async () => {
		await loadMapLibraries();

		const mapElement = document.getElementById('map') as HTMLDivElement;
		if (!mapElement) throw new Error('failed to get map element');

		const defaultCenter = { lat: -20.397, lng: -54.644 };

		map = new window.google.maps.Map(mapElement, {
			center: query.data?.point ?? defaultCenter,
			zoom: 15,
			mapId: env.PUBLIC_GOOGLE_MAPS_MAP_ID
		});
	};

	function updateMarkerPosition(position: { lat: number; lng: number }) {
		if (marker) marker.position = position;
	}

	function removeMarker() {
		if (marker) {
			marker.map = null;
			marker = null;
		}
	}

	function createMarker(position: { lat: number; lng: number }) {
		marker = new window.google.maps.marker.AdvancedMarkerElement({
			position,
			map
		});
	}

	let hasPositionToShow = $derived(!!query.data);

	onMount(async () => {
		await initMap();
		mapHasLoaded = true;
	});
</script>

<div class="card preset-filled-surface-100-900 mt-4">
	<div class="p-4 flex items-center justify-between">
		Ultima Localização:

		{#if hasPositionToShow}
			<a href={route('/client/tracking/map', { lookupTracker: vehicle?.vehicleTracker?.id })}>
				<button class="btn preset-filled-primary-200-800">
					ver no mapa principal
					<Icon icon="mdi:map" />
				</button>
			</a>
		{/if}
	</div>

	{#if !hasTrackerToGetLastPosition}
		<p class="px-4 pb-4 text-warning-200-800">Esse veículo não esta associado a um rastreador</p>
	{:else if !hasPositionToShow}
		<p class="px-4 pb-4 text-warning-200-800">Nenhuma posição encontrada</p>
	{/if}

	<div id="map" class="h-[400px] w-full" class:hidden={!hasPositionToShow}></div>
</div>
