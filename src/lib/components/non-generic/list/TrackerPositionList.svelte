<script lang="ts">
	import { apiGetTrackerLocations, type GetTrackerLocationsDto } from '$lib/api/tracker';
	import { createInfiniteQuery, keepPreviousData, type InfiniteData } from '@tanstack/svelte-query';
	import Icon from '@iconify/svelte';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import type { TrackerLocation } from '$lib/api/sim-card.schema';
	import { derived, writable } from 'svelte/store';

	export let trackerId: number;

	const pageSize = 15;

	/**
	 * the input value of the starting date filter
	 */
	let startFilter = writable('');

	const query = createInfiniteQuery<
		TrackerLocation[],
		Error,
		InfiniteData<TrackerLocation[]>,
		unknown[],
		GetTrackerLocationsDto
	>(
		derived([startFilter], ([$startFilter]) => ({
			queryKey: ['tracker', trackerId, 'locations', $startFilter],
			placeholderData: keepPreviousData,
			retry: false,
			initialPageParam: {
				limit: pageSize,
				before: $startFilter ? new Date($startFilter).toISOString() : undefined
			},
			getNextPageParam: (lastPositions: TrackerLocation[]) => ({
				limit: pageSize,
				before: lastPositions.at(-1)?.time
			}),
			queryFn: ({ pageParam }: { pageParam: GetTrackerLocationsDto }) => {
				console.log('!', pageParam);
				return apiGetTrackerLocations(trackerId, pageParam);
			}
		}))
	);

	$: hasNoPages = !$query.data?.pages;
	$: hasOneEmptyPage =
		$query.data && $query.data.pages.length === 1 && $query.data.pages[0].length === 0;
</script>

{#if $query.isPending}
	<div class="px-4 pb-4">
		<ProgressBar value={undefined} />
	</div>
{:else}
	<div class="p-4 flex items-center">
		<span class="text-lg">Positions:</span>

		<div class="ml-auto flex items-center max-w-sm">
			<label for="positions-date-start-filter" class="text-sm">search after:</label>
			<input
				bind:value={$startFilter}
				id="positions-date-start-filter"
				class="input ml-1"
				type="datetime-local"
			/>
		</div>
	</div>

	<hr />

	{#if hasNoPages || hasOneEmptyPage}
		<div class="flex items-center p-4">
			<Icon icon="mdi:info" class="mr-3" height={32} />
			<p class="text-sm">
				this tracker has no positions, meaning it is either inactive and/or has never successfully
				communicated with the rastercar platform.
			</p>
		</div>
	{:else if $query.data}
		<ul class="max-h-80 overflow-y-scroll pb-4">
			{#each $query.data.pages as positions, pageIndex}
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

				{#if pageIndex === $query.data.pages.length - 1}
					<li class="px-4 pt-4">
						<LoadableButton
							isLoading={$query.isFetching}
							contentWrapperClasses="flex items-center"
							class="btn btn-sm variant-filled-primary w-full"
							on:click={() => $query.fetchNextPage()}
							disabled={!$query.hasNextPage || $query.isFetchingNextPage}
						>
							<Icon icon="mdi:plus" class="mr-2" />
							load more
						</LoadableButton>
					</li>
				{/if}
			{/each}
		</ul>
	{/if}
{/if}
