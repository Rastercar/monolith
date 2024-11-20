<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { getMapContext } from '../map';

	interface Props {
		position: google.maps.ControlPosition;
		children?: import('svelte').Snippet;
	}

	let { position, children }: Props = $props();

	const mapContext = getMapContext();

	const map = mapContext.getGoogleMap();

	let slotData: HTMLDivElement = $state();

	const addControl = () => map.controls[position].push(slotData);
	const removeControl = () => map.controls[position].clear();

	onMount(addControl);
	onDestroy(removeControl);
</script>

<div bind:this={slotData}>
	{#if children}{@render children()}{:else}
		<div class="m-2 p-2 bg-white text-red-600 text-md rounded-md">error</div>
	{/if}
</div>
