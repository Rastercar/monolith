<script lang="ts">
	import { getMapContext } from '$lib/store/map.svelte';
	import { onDestroy, onMount, type Snippet } from 'svelte';

	interface Props {
		position: google.maps.ControlPosition;
		children?: Snippet;
	}

	let { position, children }: Props = $props();

	const mapContext = getMapContext();

	const map = mapContext.getGoogleMap();

	let slotRef = $state<HTMLDivElement>();

	const addControl = () => slotRef && map && map.controls[position].push(slotRef);
	const removeControl = () => map && map.controls[position].clear();

	onMount(addControl);
	onDestroy(removeControl);
</script>

<div bind:this={slotRef}>
	{#if children}{@render children()}{:else}
		<div class="m-2 p-2 bg-white text-red-600 text-md rounded-md">error</div>
	{/if}
</div>
