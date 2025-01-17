<script lang="ts">
	import { apiGetTrackerLastLocation } from '$lib/api/tracker';
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import { env } from '$lib/env/public-env';
	import { route } from '$lib/ROUTES';
	import { loadMapLibraries } from '$lib/utils/google-maps';
	import Icon from '@iconify/svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';

	interface Props {
		vehicle: Vehicle;
	}

	let { vehicle }: Props = $props();
	let mapHasLoaded = $state(false);

	const hasTrackerToGetLastPosition = !!vehicle.vehicleTracker?.id;

	const query = createQuery(() => ({
		// important wait for the map to load since we
		// create the tracker on the queryFn function
		enabled: hasTrackerToGetLastPosition && mapHasLoaded,
		queryKey: ['tracker', vehicle.vehicleTracker?.id, 'location-card', 'last-location'],
		queryFn: async () => {
			const position = await apiGetTrackerLastLocation(vehicle.vehicleTracker?.id ?? 0);

			if (window.google?.maps?.marker && map) {
				if (!position) {
					removeMarker();
					return position;
				}

				marker ? updateMarkerPosition(position.point) : createMarker(position.point);

				map.setCenter(position.point);
			}

			return position;
		}
	}));

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
		Last location:

		{#if hasPositionToShow}
			<a href={route('/client/tracking/map', { lookupTracker: vehicle?.vehicleTracker?.id })}>
				<button class="btn preset-filled-primary-200-800">
					see on map
					<Icon icon="mdi:map" />
				</button>
			</a>
		{/if}
	</div>

	{#if !hasTrackerToGetLastPosition}
		<p class="p-4 text-warning-200-800">This vehicle is not connected to a tracker</p>
	{:else if !hasPositionToShow}
		<p class="p-4 text-warning-200-800">No position found</p>
	{/if}

	<div id="map" class="h-[400px] w-full" class:hidden={!hasPositionToShow}></div>
</div>
