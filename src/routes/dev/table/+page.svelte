<script lang="ts">
	import { apiGetTrackers, type GetTrackersFilters } from '$lib/api/tracker';
	import type { Tracker } from '$lib/api/tracker.schema';
	import { Paginator, ProgressBar } from '@skeletonlabs/skeleton';
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import {
		createSvelteTable,
		flexRender,
		getCoreRowModel,
		type ColumnDef,
		type TableOptions
	} from '@tanstack/svelte-table';
	import { derived, writable } from 'svelte/store';

	const pagination = writable({ page: 1, pageSize: 5 });
	const filters = writable<GetTrackersFilters>({});

	const query = createQuery(
		derived([pagination, filters], ([$pagination, $filters]) => ({
			queryKey: ['trackers', $pagination, $filters],
			placeholderData: keepPreviousData,
			queryFn: async () => {
				const result = await apiGetTrackers({ pagination: $pagination, filters: $filters });

				$options.data = result.records;

				return result;
			}
		}))
	);

	const onPageChange = (e: CustomEvent) => {
		$pagination.page = e.detail + 1;
	};

	const onAmountChange = (e: CustomEvent) => {
		$pagination.pageSize = e.detail;
	};

	const columns: ColumnDef<Tracker>[] = [
		{ accessorKey: 'id', header: () => 'ID' },
		{ accessorKey: 'imei', header: () => 'IMEI' },
		{ accessorKey: 'model', header: () => 'Model' },
		{ accessorKey: 'vehicleId', header: () => 'Vehicle ID' }
	];

	let debounceTimer: ReturnType<typeof setTimeout>;

	const debounce = (v: string, delay: number) => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			$filters.imei = v;
		}, delay);
	};

	const options = writable<TableOptions<Tracker>>({
		data: $query.data?.records ?? [],
		columns: columns,
		manualPagination: true,
		state: {
			pagination: {
				pageIndex: $pagination.page,
				pageSize: $pagination.pageSize
			}
		},
		getCoreRowModel: getCoreRowModel()
	});

	const table = createSvelteTable(options);
</script>

<!-- TODO: better css -->
<!-- TODO: single row selection -->
<!-- TODO: integrate with quick track form -->
<div class="overflow-y-scroll flex items-center justify-center space-x-4">
	<div>
		<label class="label my-4">
			<span>Filtrar por IMEI {$filters.imei}</span>
			<input
				class="input"
				title="Buscar por IMEI"
				type="text"
				on:keyup={(e) => debounce(e.currentTarget.value, 250)}
			/>
		</label>

		<!-- TODO: componentize data table elements ? -->
		<table class="bg-slate-700 w-full mb-4">
			<thead>
				{#each $table.getHeaderGroups() as headerGroup}
					<tr>
						{#each headerGroup.headers as header}
							<th class="p-4 border-x-2 border-t-2">
								{#if !header.isPlaceholder}
									<svelte:component
										this={flexRender(header.column.columnDef.header, header.getContext())}
									/>
								{/if}
							</th>
						{/each}
					</tr>
					<!-- TODO: isso fica dando 1 efeito de "pulo", toda vez q true, arrumar -->
					{#if $query.isLoading || $query.isFetching}
						<tr>
							<th colspan={columns.length} class="border-x-2">
								<ProgressBar value={undefined} rounded="rounded-none" />
							</th>
						</tr>
					{/if}
				{/each}
			</thead>

			<tbody class="border-2">
				<!-- TODO: handler para no data available -->
				{#each $table.getRowModel().rows as row}
					<tr>
						{#each row.getVisibleCells() as cell}
							<td
								class="p-4 border-t-2"
								class:text-blue-500={$query.isLoading || $query.isFetching}
							>
								<svelte:component
									this={flexRender(cell.column.columnDef.cell, cell.getContext())}
								/>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>

		<Paginator
			settings={{
				page: $pagination.page - 1,
				limit: $pagination.pageSize,
				size: $query.data?.itemCount ?? 0,
				amounts: [1, 5, 10, 15]
			}}
			showNumerals
			showFirstLastButtons
			maxNumerals={3}
			on:page={onPageChange}
			on:amount={onAmountChange}
		/>

		<div class="flex mt-4 space-x-4">
			<div>
				<pre class="p-4 border-2 border-purple-400 mb-4">
					{JSON.stringify($filters, null, 2)}
				</pre>

				<pre class="p-4 border-2 border-red-400 mb-4">
					{JSON.stringify($pagination, null, 2)}
				</pre>

				<pre class="p-4 border-2 border-blue-400">
					{JSON.stringify($options.state, null, 2)}
				</pre>
			</div>

			<pre class="p-4 border-2 border-green-400">
				{JSON.stringify($query.data, null, 2)}
			</pre>
		</div>
	</div>
</div>
