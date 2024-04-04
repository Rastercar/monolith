<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { getMapContext, type Position } from '../map';
	import Icon from '@iconify/svelte';
	import { getDrawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';
	import SelectedTrackerOverlay from './SelectedTrackerOverlay.svelte';
	import type { Tracker } from '$lib/api/tracker.schema';

	export let tracker: Tracker;

	export let position: Position;

	let markerContentElement: HTMLElement;

	let markerInstance: InstanceType<typeof google.maps.marker.AdvancedMarkerElement> | null = null;

	const mapContext = getMapContext();

	const map = mapContext.getGoogleMap();

	const drawerStore = getDrawerStore();

	const dispatch = createEventDispatcher<{ click: google.maps.marker.AdvancedMarkerElement }>();

	const addMarkerToMap = () => {
		markerInstance = new google.maps.marker.AdvancedMarkerElement({
			map,
			content: markerContentElement,
			position
		});

		markerInstance.addListener('click', () => {
			map.panTo(position);

			const drawerSettings: DrawerSettings = {
				position: 'right',
				width: 'max-w-xl',
				meta: {
					component: SelectedTrackerOverlay,
					props: { tracker, position }
				}
			};

			drawerStore.open(drawerSettings);

			if (!markerInstance) return;
			dispatch('click', markerInstance);
		});
	};

	const removeMarkerFromMap = () => {
		if (markerInstance) markerInstance.map = null;
	};

	onMount(addMarkerToMap);
	onDestroy(removeMarkerFromMap);

	$: {
		if (position && markerInstance) {
			markerInstance.position = position;
		}
	}
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
