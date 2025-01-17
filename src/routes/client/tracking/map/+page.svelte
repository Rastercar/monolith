<script>
	import TrackerMap from './components/TrackerMap.svelte';

	const { data } = $props();
	const { initialTrackerSelection } = data;
</script>

<TrackerMap {initialTrackerSelection} />
