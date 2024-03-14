<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { getMapContext } from '../map';

	export let position: google.maps.ControlPosition;

	const mapContext = getMapContext();

	const map = mapContext.getGoogleMap();

	let slotData: HTMLDivElement;

	const addControl = () => map.controls[position].push(slotData);
	const removeControl = () => map.controls[position].clear();

	onMount(addControl);
	onDestroy(removeControl);
</script>

<div bind:this={slotData}>
	<slot>
		<div class="m-2 p-2 bg-white text-red-600 text-md rounded-md">error</div>
	</slot>
</div>
