<script lang="ts">
	import type { Tracker } from '$lib/api/tracker.schema';
	import { getMapContext } from '$lib/store/context';
	import Icon from '@iconify/svelte';
	import TrackerListItem from './TrackerListItem.svelte';

	interface Props {
		onCloseClick: () => void;
	}

	const { onCloseClick }: Props = $props();

	const ctx = getMapContext();

	let imeiFilter = $state('');

	const trackers: Tracker[] = $derived.by(() => {
		const trackers = Object.values(ctx.mapSelectedTrackers);

		const filter = imeiFilter.toLocaleLowerCase();

		// TODO: remove duplication
		return [...trackers, ...trackers, ...trackers, ...trackers].filter((t) => {
			if (!imeiFilter) return true;
			return t.imei.toLocaleLowerCase().includes(filter);
		});
	});
	const trackersCnnt = $derived(Object.keys(ctx.mapSelectedTrackers).length);
</script>

<div class="sticky top-0 bg-surface-100-900 z-10 p-4">
	<h2 class="flex items-center type-scale-6 mb-4">
		<Icon icon="mdi:list-status" class="mr-2 hidden md:block" height={32} />
		Selected trackers ({trackersCnnt})

		<Icon icon="mdi:close" onclick={onCloseClick} class="ml-auto" height={32} />
	</h2>

	<input class="input" placeholder="filter by imei" type="text" bind:value={imeiFilter} />
</div>

<ul class="space-y-4 overflow-y-auto px-4">
	{#each trackers as tracker}
		<TrackerListItem {tracker} />
	{/each}
</ul>
