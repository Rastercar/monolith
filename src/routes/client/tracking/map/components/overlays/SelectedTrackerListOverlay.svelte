<script lang="ts">
	import type { Tracker } from '$lib/api/tracker.schema';
	import { getMapContext } from '$lib/store/context';
	import type { Position } from '$lib/store/map.svelte';
	import Icon from '@iconify/svelte';
	import SelectedTrackerOverlay from './SelectedTrackerOverlay.svelte';
	import TrackerListItem from './TrackerListItem.svelte';

	interface Props {
		onCloseClick: () => void;
	}

	const { onCloseClick }: Props = $props();

	const ctx = getMapContext();

	let imeiFilter = $state('');

	let trackerAndPositionToShow = $state<{ tracker: Tracker; position: Position } | null>(null);

	const { trackers, trackersCnt } = $derived.by(() => {
		const selectedTrackers = Object.values(ctx.mapSelectedTrackers);

		const filter = imeiFilter.toLocaleLowerCase();

		// TODO: remove duplication
		const trckers = [
			...selectedTrackers,
			...selectedTrackers,
			...selectedTrackers,
			...selectedTrackers
		].filter((t) => {
			if (!imeiFilter) return true;
			return t.imei.toLocaleLowerCase().includes(filter);
		});

		return { trackers: trckers as Tracker[], trackersCnt: selectedTrackers.length };
	});
</script>

{#if trackerAndPositionToShow == null}
	<div class="sticky top-0 bg-surface-100-900 z-10 p-4">
		<h2 class="flex items-center type-scale-6 mb-4">
			<Icon icon="mdi:list-status" class="mr-2 hidden md:block" height={32} />
			Selected trackers ({trackersCnt})

			<Icon icon="mdi:close" onclick={onCloseClick} class="ml-auto" height={32} />
		</h2>

		<input class="input" placeholder="filter by imei" type="text" bind:value={imeiFilter} />
	</div>

	<ul class="space-y-4 overflow-y-auto px-4">
		<!-- TODO: remove mock hardcoded position -->
		{#each trackers as tracker}
			<TrackerListItem
				{tracker}
				position={{
					lat: 1,
					lng: 2,
					timestamp: new Date().toISOString()
				}}
				onInfoClick={() => {
					trackerAndPositionToShow = {
						tracker,
						position: {
							lat: 1,
							lng: 2,
							timestamp: new Date().toISOString()
						}
					};
				}}
			/>
		{/each}
	</ul>
{:else}
	<SelectedTrackerOverlay
		tracker={trackerAndPositionToShow.tracker}
		position={trackerAndPositionToShow.position}
	>
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
