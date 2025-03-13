<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { getMapContext } from '$lib/store/context';
	import { isOnMobileViewPort } from '$lib/utils/viewport';
	import Icon from '@iconify/svelte';
	import MapControl from '../../MapControl.svelte';

	const mapContext = getMapContext();

	const fitMapToTrackersBeingShown = () => {
		const bounds = mapContext.getTrackersMapBounds();
		if (!bounds.isEmpty()) mapContext.mapInstance?.fitBounds(bounds);
	};

	const { isMobileViewport } = isOnMobileViewPort();

	const selectedTrackerCnt = $derived(
		Object.keys(mapContext.realTimeMapViewState.selectedTrackers).length
	);
</script>

<MapControl position={window.google.maps.ControlPosition.TOP_RIGHT}>
	<div class="flex flex-col">
		<button
			onclick={() => (mapContext.realTimeMapViewState.overlay = 'select-tracker')}
			class="m-[10px] h-[70px] flex flex-col px-4 shadow-lg text-black bg-white hover:bg-surface-50 rounded-sm border border-surface-300"
		>
			<div class="my-auto">
				<div class="flex items-center text-lg">
					<Icon icon="mdi:cellphone" class="mr-1" />Rastreadores
				</div>

				<div class="mt-[4px]">
					{selectedTrackerCnt}
					{selectedTrackerCnt > 1 ? 'selecionados' : 'selecionado'}
				</div>
			</div>
		</button>

		<button
			onclick={() => (mapContext.realTimeMapViewState.overlay = 'selected-tracker-list')}
			class="m-[10px] h-[40px] flex items-center px-4 shadow-lg text-black bg-white hover:bg-surface-50 rounded-sm border border-surface-300 text-lg ml-auto"
		>
			<Icon icon="mdi:info" />
		</button>
	</div>
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
			<Icon icon="mdi:image-filter-center-focus" class="mr-1" />centralizar
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
			href={route('/client')}
			onclick={fitMapToTrackersBeingShown}
			class="m-[10px] h-[40px] flex items-center px-4 shadow-lg text-black bg-white hover:bg-surface-50 rounded-sm border border-surface-300 text-lg"
		>
			<Icon icon="mdi:arrow-left" />
		</a>
	</MapControl>
{/if}
