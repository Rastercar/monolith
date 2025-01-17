<script lang="ts">
	import type { Tracker } from '$lib/api/tracker.schema';
	import { getMapContext, type Position } from '$lib/store/map.svelte';
	import Icon from '@iconify/svelte';
	import { onDestroy, onMount } from 'svelte';

	interface Props {
		tracker: Tracker;
		position: Position;
		onClick: (_: google.maps.marker.AdvancedMarkerElement) => void;
	}

	let { tracker, position, onClick }: Props = $props();

	let markerContentElement = $state<HTMLDivElement>();

	let markerInstance: InstanceType<typeof google.maps.marker.AdvancedMarkerElement> | null =
		$state(null);

	const mapContext = getMapContext();

	const map = mapContext.getGoogleMap();

	const addMarkerToMap = () => {
		if (!map) return;

		markerInstance = new google.maps.marker.AdvancedMarkerElement({
			map,
			content: markerContentElement,
			position
		});

		markerInstance.addListener('click', () => {
			map.panTo(position);

			if (!markerInstance) return;
			onClick(markerInstance);
		});

		if (position && markerInstance) {
			markerInstance.position = position;
		}
	};

	const removeMarkerFromMap = () => {
		if (markerInstance) markerInstance.map = null;
	};

	$effect(() => {
		if (!markerInstance) return;
		markerInstance.position = position;
	});

	onMount(addMarkerToMap);
	onDestroy(removeMarkerFromMap);
</script>

<div
	aria-hidden="true"
	bind:this={markerContentElement}
	class="map-tracker px-1 py-2 rounded-xl flex justify-center"
>
	<Icon icon="mdi:cellphone-marker" height={24} />
</div>

<style>
	.map-tracker {
		background-color: #3b82f6;
	}

	.map-tracker:after {
		content: '';
		position: absolute;
		top: 95%;
		left: 50%;
		width: 0;
		height: 0;
		margin-left: -8px;
		border-top: solid 10px #3b82f6;
		border-left: solid 8px transparent;
		border-right: solid 8px transparent;
	}
</style>
