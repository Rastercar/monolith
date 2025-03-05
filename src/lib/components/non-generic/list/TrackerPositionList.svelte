<script lang="ts">
	import { apiGetTrackerLocations } from '$lib/api/tracker';
	import type { GetTrackerLocationsFilters, TrackerLocation } from '$lib/api/tracker.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import Icon from '@iconify/svelte';
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
		GetTrackerLocationsFilters
	>(() => ({
		queryKey: ['tracker', trackerId, 'locations', { after: startFilter }],
		queryFn: async ({ pageParam }: { pageParam: GetTrackerLocationsFilters }) =>
			apiGetTrackerLocations(trackerId, pageParam),
		placeholderData: keepPreviousData,
		retry: false,
		initialPageParam: {
			limit: pageSize,
			after: startFilter ? new Date(startFilter).toISOString() : undefined
		},
		getNextPageParam: (lastPositions: TrackerLocation[]) => ({
			limit: pageSize,
			before: lastPositions.at(-1)?.time
		})
	}));

	let hasNoPages = $derived(!query.data?.pages);

	let hasOneEmptyPage = $derived(
		query.data && query.data.pages.length === 1 && query.data.pages[0].length === 0
	);
</script>

<div class="p-4 flex flex-col sm:flex-row">
	<div class="text-lg mr-auto mb-2 sm:mb-0">Posições:</div>

	<div class="max-w-xs">
		<label for="positions-date-start-filter" class="mb-2 block">buscar após</label>
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
		<Icon icon="mdi:info" class=" mr-3 hidden md:block" height={32} />

		{#if startFilter === ''}
			<p>
				esse rastreador não tem nenhuma posição, ou seja ou ele está inativo ou nunca teve sucesso
				ao se comunicar com a plataforma
			</p>
		{:else}
			<p>nenhuma posição encontrada</p>
		{/if}
	</div>
{:else if query.data}
	<ul class="max-h-80 overflow-y-scroll pb-4">
		{#each query.data.pages as positions, pageIndex}
			{#each positions as position, itemIndex}
				{@const itemNumber = pageIndex * pageSize + (itemIndex + 1)}

				<li class="md:flex items-center px-4 py-3 hover:bg-surface-300-700">
					<div class="flex items-center mr-4">
						<Icon icon="mdi:calendar" class="mr-2" />
						{new Date(position.time).toLocaleString()}
					</div>

					<div class="flex items-center mr-4">
						<Icon icon="mdi:location" class="mr-2" />
						{position.point.lat.toFixed(5)}, {position.point.lng.toFixed(5)}
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
						carregar mais
					</LoadableButton>
				</li>
			{/if}
		{/each}
	</ul>
{/if}
