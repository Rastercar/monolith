<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { getMapContext } from '../map';

	export let position: google.maps.LatLngLiteral;

	const mapContext = getMapContext();

	let markerInstance: InstanceType<typeof window.google.maps.marker.AdvancedMarkerElement> | null =
		null;

	const addMarkerToMap = () => {
		const map = mapContext.getGoogleMap();

		markerInstance = new window.google.maps.marker.AdvancedMarkerElement({
			map,
			position
		});
	};

	const removeMarkerFromMap = () => {
		if (markerInstance) markerInstance.map = null;
	};

	onMount(addMarkerToMap);
	onDestroy(removeMarkerFromMap);
</script>
