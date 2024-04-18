<script lang="ts">
	import { apiGetTrackerLocations, type GetTrackerLocationsDto } from '$lib/api/tracker';
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import Icon from '@iconify/svelte';
	import { derived, writable } from 'svelte/store';
	import { ProgressBar } from '@skeletonlabs/skeleton';

	export let trackerId: number;

	const filters = writable<GetTrackerLocationsDto>({});

	const query = createQuery(
		derived([filters], ([$filters]) => ({
			queryKey: ['tracker', trackerId, 'locations', $filters],
			retry: false,
			placeholderData: keepPreviousData,
			queryFn: () => apiGetTrackerLocations(trackerId, $filters)
		}))
	);

	const loadPositinsAfterDate = (date: string) => {
		$filters.start = date;
	};

	$: ({ data: positions, isLoading } = $query);
</script>

<div>
	<div class="pt-4 px-4 mb-2 text-lg">Positions</div>
	{#if isLoading}
		<div class="px-4 pb-4">
			<ProgressBar value={undefined} />
		</div>
	{:else if positions && positions.length > 0}
		<ul class="max-h-80 overflow-y-scroll pb-4">
			{#each positions as position, i}
				<li class="flex items-center px-4 py-3 hover:bg-surface-500">
					<div class="flex items-center mr-4">
						<Icon icon="mdi:calendar" class="mr-2" />
						{new Date(position.time).toLocaleString()}
					</div>

					<div class="flex items-center mr-4">
						<Icon icon="mdi:location" class="mr-2" />
						{position.point.x.toFixed(5)}, {position.point.y.toFixed(5)}
					</div>

					<span class="ml-auto text-xs opacity-50">#{(i + 1).toString().padStart(3, '0')}</span>
				</li>
			{/each}

			<li class="flex justify-end px-4 mt-4">
				<button
					disabled={isLoading}
					class="btn btn-sm variant-filled-primary w-full"
					on:click={() => {
						if (!positions) return;
						let { time } = positions[positions.length - 1];

						// TODO: ver questão de filtro por data/hora de inicio
						// TODO: ver questão de filtro por data fim (limitar time window para uma busca que resulte em no maximo 500 posições)
						// (assumindo 1 posição a cada 3 segundos, temos 20 por minuto e 1200 por hora, ou seja, a busca poderia te no máximo
						// +- 40 minutos, isso é uma merda, devemos ter essa feature mesmo ?
						// TODO: FINISH INFINITE SCROLLING, ver virtual scrolling para performance
						// https://blog.logrocket.com/virtual-scrolling-core-principles-and-basic-implementation-in-react/
						loadPositinsAfterDate(time);
					}}
				>
					<Icon icon="mdi:plus" class="mr-2" />
					load more
				</button>
			</li>
		</ul>
	{:else}
		<div class="flex items-center px-4 pb-4">
			<Icon icon="mdi:info" class="mr-3" height={32} />
			<p class="text-sm">
				this tracker has no positions, meaning it is either inactive and/or has never successfully
				communicated with the rastercar platform.
			</p>
		</div>
	{/if}
</div>
