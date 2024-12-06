<script lang="ts">
	import type { TrackerLocation } from '$lib/api/sim-card.schema';
	import type { GetTrackerLocationsDto } from '$lib/api/tracker';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import Icon from '@iconify/svelte';
	import { Progress } from '@skeletonlabs/skeleton-svelte';
	import { createInfiniteQuery, keepPreviousData, type InfiniteData } from '@tanstack/svelte-query';

	interface Props {
		trackerId: number;
	}

	let { trackerId }: Props = $props();

	const pageSize = 15;

	/**
	 * the input value of the starting date filter
	 */
	let startFilter = $state('');

	const query = createInfiniteQuery<
		TrackerLocation[],
		Error,
		InfiniteData<TrackerLocation[]>,
		unknown[],
		GetTrackerLocationsDto
	>(() => ({
		queryKey: ['tracker', trackerId, 'locations', startFilter],
		placeholderData: keepPreviousData,
		retry: false,
		initialPageParam: {
			limit: pageSize,
			before: startFilter ? new Date(startFilter).toISOString() : undefined
		},
		getNextPageParam: (lastPositions: TrackerLocation[]) => ({
			limit: pageSize,
			before: lastPositions.at(-1)?.time
		}),
		queryFn: async () => []
		// TODO:
		// queryFn: ({ pageParam }: { pageParam: GetTrackerLocationsDto }) =>
		// apiGetTrackerLocations(trackerId, pageParam)
	}));

	let hasNoPages = $derived(!query.data?.pages);

	let hasOneEmptyPage = $derived(
		query.data && query.data.pages.length === 1 && query.data.pages[0].length === 0
	);
</script>

{#if query.isPending}
	<div class="px-4 pb-4">
		<Progress value={null} />
	</div>
{:else}
	<div class="p-4 flex items-center">
		<span class="text-lg">Positions:</span>

		<div class="ml-auto flex items-center max-w-sm">
			<label for="positions-date-start-filter" class="type-scale-2">search after:</label>
			<input
				bind:value={startFilter}
				class="input"
				id="positions-date-start-filter"
				type="datetime-local"
			/>
		</div>
	</div>

	<hr class="hr my-2" />

	{#if hasNoPages || hasOneEmptyPage}
		<div class="flex items-center p-4">
			<Icon icon="mdi:info" class="mr-3" height={32} />
			<p class="text-sm">
				this tracker has no positions, meaning it is either inactive and/or has never successfully
				communicated with the rastercar platform.
			</p>
		</div>
	{:else if query.data}
		<ul class="max-h-80 overflow-y-scroll pb-4">
			{#each query.data.pages as positions, pageIndex}
				{#each positions as position, itemIndex}
					{@const itemNumber = pageIndex * pageSize + (itemIndex + 1)}

					<li class="flex items-center px-4 py-3 hover:bg-surface-500">
						<div class="flex items-center mr-4">
							<Icon icon="mdi:calendar" class="mr-2" />
							{new Date(position.time).toLocaleString()}
						</div>

						<div class="flex items-center mr-4">
							<Icon icon="mdi:location" class="mr-2" />
							{position.point.x.toFixed(5)}, {position.point.y.toFixed(5)}
						</div>

						<span class="ml-auto text-xs opacity-50">
							#{itemNumber.toString().padStart(3, '0')}
						</span>
					</li>
				{/each}

				{#if pageIndex === query.data.pages.length - 1}
					<li class="px-4 pt-4">
						<LoadableButton
							isLoading={query.isFetching}
							contentWrapperClass="flex items-center"
							classes="btn btn-sm preset-filled-primary-200-800 w-full"
							onclick={() => query.fetchNextPage()}
							disabled={!query.hasNextPage || query.isFetchingNextPage}
						>
							<Icon icon="mdi:plus" />
							load more
						</LoadableButton>
					</li>
				{/if}
			{/each}
		</ul>
	{/if}
{/if}
