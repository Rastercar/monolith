<script lang="ts">
	import { apiGetTrackersLastPositionsQuery } from '$lib/api/tracking.queries';
	import { getMapContext } from '$lib/store/context';
	import Icon from '@iconify/svelte';
	import type { TrackerAndPosition } from '../../../../map';
	import SelectedTrackerOverlay from './SelectedTrackerOverlay.svelte';
	import TrackerListItem from './TrackerListItem.svelte';

	interface Props {
		onCloseClick: VoidFunction;
	}

	const { onCloseClick }: Props = $props();

	const ctx = getMapContext();

	let imeiFilter = $state('');

	let trackerAndPositionToShow = $state<TrackerAndPosition | null>(null);

	const getMapSelectedTrackerIds = () =>
		Object.keys(ctx.realTimeMapViewState.selectedTrackers).map((k) => parseInt(k));

	const mapSelectedTrackers = $derived(Object.values(ctx.realTimeMapViewState.selectedTrackers));

	const query = apiGetTrackersLastPositionsQuery(getMapSelectedTrackerIds());

	const queryData: TrackerAndPosition[] = $derived.by(() => {
		return mapSelectedTrackers.map((tracker) => ({
			tracker,
			position: query.data?.find((p) => p.trackerId === tracker.id)
		}));
	});

	const filteredTrackers = $derived.by(() => {
		const filter = imeiFilter.toLocaleLowerCase();
		return queryData.filter((t) => !imeiFilter || t.tracker.imei.toLowerCase().includes(filter));
	});
</script>

{#if trackerAndPositionToShow == null}
	<div class="sticky top-0 bg-surface-100-900 z-10 p-4">
		<h2 class="flex items-center text-xl mb-4">
			<Icon icon="mdi:list-status" class="mr-2 hidden md:block" height={32} />
			Rastreadores selecionados ({getMapSelectedTrackerIds().length})

			<Icon icon="mdi:close" onclick={onCloseClick} class="ml-auto" height={32} />
		</h2>

		<input class="input" placeholder="filtrar por IMEI" type="text" bind:value={imeiFilter} />
	</div>

	<ul class="space-y-4 overflow-y-auto px-4">
		{#each filteredTrackers as trackerWithPosition}
			<TrackerListItem
				{trackerWithPosition}
				onInfoClick={() => (trackerAndPositionToShow = trackerWithPosition)}
			/>
		{/each}
	</ul>
{:else}
	<SelectedTrackerOverlay trackerWithPosition={trackerAndPositionToShow}>
		{#snippet title()}
			<div class="ml-auto">
				<button
					class="text-sm btn preset-filled-secondary-200-800"
					onclick={() => {
						trackerAndPositionToShow = null;
					}}
				>
					Voltar
					<Icon icon="mdi:arrow-left" />
				</button>
			</div>
		{/snippet}
	</SelectedTrackerOverlay>
{/if}
