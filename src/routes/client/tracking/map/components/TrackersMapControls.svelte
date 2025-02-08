<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { getMapContext } from '$lib/store/context';
	import { isOnMobileViewPort } from '$lib/store/viewport.svelte';
	import Icon from '@iconify/svelte';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import MapControl from './MapControl.svelte';
	import SelectTrackerOverlay from './SelectTrackerOverlay.svelte';

	const mapContext = getMapContext();
	let isSelectTrackerOverlayOpen = $state(false);

	const fitMapToTrackersBeingShown = () => {
		const bounds = mapContext.getTrackersMapBounds();
		if (!bounds.isEmpty()) mapContext.mapInstance?.fitBounds(bounds);
	};

	const { isMobileViewport } = isOnMobileViewPort();
</script>

<MapControl position={window.google.maps.ControlPosition.TOP_RIGHT}>
	<button
		onclick={() => (isSelectTrackerOverlayOpen = true)}
		class="m-[10px] h-[60px] flex flex-col px-4 shadow-lg text-black bg-white hover:bg-surface-50 rounded-sm border border-surface-300"
	>
		<div class="my-auto">
			<div class="flex items-center type-scale-3">
				<Icon icon="mdi:car" class="mr-1" /> Trackers
			</div>

			<div class="mt-[4px]">{Object.keys(mapContext.mapSelectedTrackers).length} selected</div>
		</div>
	</button>
</MapControl>

<MapControl
	position={isMobileViewport
		? window.google.maps.ControlPosition.BLOCK_END_INLINE_CENTER
		: window.google.maps.ControlPosition.TOP_LEFT}
>
	<button
		onclick={fitMapToTrackersBeingShown}
		class="m-[10px] h-[40px] flex items-center px-4 shadow-lg text-black bg-white hover:bg-surface-50 rounded-sm border border-surface-300"
	>
		<div class="flex items-center text-lg">
			<Icon icon="mdi:image-filter-center-focus" class="mr-1" /> center
		</div>
	</button>
</MapControl>

{#if isMobileViewport}
	<MapControl
		position={isMobileViewport
			? window.google.maps.ControlPosition.INLINE_START_BLOCK_CENTER
			: window.google.maps.ControlPosition.TOP_LEFT}
	>
		<a
			href={route('/client/my-profile')}
			onclick={fitMapToTrackersBeingShown}
			class="m-[10px] h-[40px] flex items-center px-4 shadow-lg text-black bg-white hover:bg-surface-50 rounded-sm border border-surface-300 text-lg"
		>
			<Icon icon="mdi:arrow-left" />
		</a>
	</MapControl>
{/if}

<Modal
	bind:open={isSelectTrackerOverlayOpen}
	contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl h-screen md:h-[600px] w-screen"
	contentClasses="overflow-auto"
	triggerClasses="hidden"
	positionerJustify="justify-end"
	positionerAlign="items-end"
	positionerPadding=""
>
	{#snippet content()}
		<SelectTrackerOverlay onCloseClick={() => (isSelectTrackerOverlayOpen = false)} />
	{/snippet}
</Modal>
