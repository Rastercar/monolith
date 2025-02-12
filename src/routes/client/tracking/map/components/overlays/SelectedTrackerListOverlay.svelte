<script lang="ts">
	import { apiGetTrackersLastPositions } from '$lib/api/tracking';
	import { getMapContext } from '$lib/store/context';
	import Icon from '@iconify/svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { TrackerAndPosition } from '../../map';
	import SelectedTrackerOverlay from './SelectedTrackerOverlay.svelte';
	import TrackerListItem from './TrackerListItem.svelte';

	interface Props {
		onCloseClick: () => void;
	}

	const { onCloseClick }: Props = $props();

	const ctx = getMapContext();

	let imeiFilter = $state('');

	let trackerAndPositionToShow = $state<TrackerAndPosition | null>(null);

	const getInitialData = (): TrackerAndPosition[] => {
		const filter = imeiFilter.toLocaleLowerCase();

		return Object.values(ctx.mapSelectedTrackers)
			.map((t) => ({ tracker: t }))
			.filter((t) => !imeiFilter || t.tracker.imei.toLowerCase().includes(filter));
	};

	const query = createQuery(() => ({
		queryKey: ['trackers', Object.keys(ctx.mapSelectedTrackers), 'with-last-location'],
		queryFn: async (): Promise<TrackerAndPosition[]> => {
			const trackers = Object.values(ctx.mapSelectedTrackers);

			const positions = await apiGetTrackersLastPositions(trackers.map((t) => t.id));

			return trackers.map((tracker) => ({
				tracker,
				position: positions.find((p) => p.trackerId === tracker.id)
			}));
		},
		initialData: getInitialData()
	}));

	const filteredTrackers = $derived.by(() => {
		const filter = imeiFilter.toLocaleLowerCase();
		return query.data.filter((t) => !imeiFilter || t.tracker.imei.toLowerCase().includes(filter));
	});
</script>

{#if trackerAndPositionToShow == null}
	<div class="sticky top-0 bg-surface-100-900 z-10 p-4">
		<h2 class="flex items-center type-scale-6 mb-4">
			<Icon icon="mdi:list-status" class="mr-2 hidden md:block" height={32} />
			Selected trackers ({query.data.length})

			<Icon icon="mdi:close" onclick={onCloseClick} class="ml-auto" height={32} />
		</h2>

		<input class="input" placeholder="filter by imei" type="text" bind:value={imeiFilter} />
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
					class="type-scale-1 btn preset-filled-secondary-200-800"
					onclick={() => {
						trackerAndPositionToShow = null;
					}}
				>
					Go back
					<Icon icon="mdi:arrow-left" />
				</button>
			</div>
		{/snippet}
	</SelectedTrackerOverlay>
{/if}
