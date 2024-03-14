<script lang="ts">
	import { onMount } from 'svelte';
	import { getMapContext } from '../map';

	export let position: google.maps.LatLngLiteral;

	const mapContext = getMapContext();

	const addMarkerToMap = () => {
		const map = mapContext.getGoogleMap();

		new window.google.maps.marker.AdvancedMarkerElement({
			map,
			position
		});
	};

	onMount(() => setTimeout(addMarkerToMap, 100));
</script>
