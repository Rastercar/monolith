<script>
	import { setMapContext, getMapContext } from '$lib/store/context';
	import Map from './components/Map.svelte';
	import RealTimeMapOverlays from './components/views/realTime/overlays/RealTimeMapOverlays.svelte';

	setMapContext();
	const ctx = getMapContext();

	const { data } = $props();
	const { initialTrackerSelection } = data;

	if (initialTrackerSelection) ctx.realTimeMapViewState.selectedTrackers = initialTrackerSelection;
</script>

<Map />

<!-- 
overlays are rendered here and not inside the map
because if modals are inside the map div we get
some weird CSS / click event behaviors
-->
{#if ctx.mapView === 'real-time'}
	<RealTimeMapOverlays />
{/if}
