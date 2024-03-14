<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { layoutStore } from '$lib/store/layout';
	import TrackerMap from './components/TrackerMap.svelte';

	onMount(() => {
		$layoutStore.showHeader = false;
	});

	onDestroy(() => {
		$layoutStore.showHeader = true;
	});
</script>

<TrackerMap />
