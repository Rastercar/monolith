<script lang="ts">
	import { getMapContext } from '$lib/store/context';
	import { onDestroy, onMount, type Snippet } from 'svelte';

	interface Props {
		position: google.maps.ControlPosition;
		children?: Snippet;
	}

	let { position, children }: Props = $props();

	const mapCtx = getMapContext();

	let slotRef = $state<HTMLDivElement>();

	const addControl = () =>
		slotRef && mapCtx.mapInstance && mapCtx.mapInstance.controls[position].push(slotRef);

	const removeControl = () => mapCtx.mapInstance && mapCtx.mapInstance.controls[position].clear();

	onMount(addControl);
	onDestroy(removeControl);
</script>

<div bind:this={slotRef}>
	{#if children}{@render children()}{:else}
		<div class="m-2 p-2 bg-white text-red-600 text-md rounded-md">error</div>
	{/if}
</div>
