<script>
	import { setMapContext } from '$lib/store/context';
	import MapOverlays from './components/overlays/MapOverlays.svelte';
	import TrackerMap from './components/TrackerMap.svelte';

	setMapContext();

	const { data } = $props();
	const { initialTrackerSelection } = data;
</script>

<TrackerMap {initialTrackerSelection} />

<MapOverlays />
