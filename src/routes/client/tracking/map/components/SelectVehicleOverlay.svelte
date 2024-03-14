<script lang="ts">
	import type { Paginated } from '$lib/api/common';
	import { apiGetTrackers, type GetTrackersFilters } from '$lib/api/tracker';
	import type { Tracker } from '$lib/api/tracker.schema';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import Icon from '@iconify/svelte';
	import { getDrawerStore, Paginator } from '@skeletonlabs/skeleton';
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import {
		type ColumnDef,
		type TableOptions,
		createSvelteTable,
		getCoreRowModel,
		renderComponent,
		type OnChangeFn,
		type RowSelectionState
	} from '@tanstack/svelte-table';
	import { derived, writable } from 'svelte/store';
	import SimpleCheckbox from '$lib/components/input/SimpleCheckbox.svelte';
	import { mapStore } from '../map';
	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/motion';

	const drawerStore = getDrawerStore();

	const pagination = writable({ page: 1, pageSize: 5 });

	const filters = writable<GetTrackersFilters>({});

	const query = createQuery(
		derived([pagination, filters], ([$pagination, $filters]) => ({
			queryKey: ['trackers', $pagination, $filters],
			placeholderData: keepPreviousData,
			queryFn: async (): Promise<Paginated<Tracker>> => {
				const result = await apiGetTrackers({ pagination: $pagination, filters: $filters });

				$options.data = result.records;

				return result;
			}
		}))
	);

	const columns: ColumnDef<Tracker>[] = [
		{
			accessorKey: 'model',
			header: () => 'Model'
		},
		{
			accessorKey: 'imei',
			header: () => 'IMEI'
		},
		{
			id: 'selector',
			cell: (cell) =>
				renderComponent(SimpleCheckbox, {
					checked: cell.row.getIsSelected(),
					disabled: !cell.row.getCanSelect(),
					indeterminate: cell.row.getIsSomeSelected(),
					onChange: cell.row.getToggleSelectedHandler()
				})
		}
	];

	const colspan = columns.length;

	const onRowSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
		if (updater instanceof Function) {
			$mapStore.selectedTrackers = updater($mapStore.selectedTrackers);
		} else {
			$mapStore.selectedTrackers = updater;
		}
	};

	let unsubscribeFromMapStoreChanges: Unsubscriber | null = null;

	const options = writable<TableOptions<Tracker>>({
		data: $query.data?.records ?? [],
		columns: columns,
		manualPagination: true,
		state: {
			// initialize the data table with the selected trackers from the mapStore
			rowSelection: { ...$mapStore.selectedTrackers },
			pagination: {
				pageIndex: $pagination.page,
				pageSize: $pagination.pageSize
			}
		},
		// Important, use the row item ID as the row ID and not the row IDX,
		// since we still need to known what items are selected even after the
		// dataset changes
		getRowId: (e) => e.id.toString(),
		onRowSelectionChange,
		getCoreRowModel: getCoreRowModel()
	});

	const table = createSvelteTable(options);

	onMount(() => {
		unsubscribeFromMapStoreChanges = mapStore.subscribe((v) => {
			options.update((old) => ({
				...old,
				state: { ...old.state, rowSelection: v.selectedTrackers }
			}));
		});
	});

	onDestroy(() => {
		if (unsubscribeFromMapStoreChanges) unsubscribeFromMapStoreChanges();
	});
</script>

<div class="flex justify-between my-4">
	<div class="mx-auto w-full max-w-2xl">
		<h2 class="flex items-center mb-4 text-2xl mx-auto">
			<Icon icon="mdi:satellite" class="mr-2" height={36} />
			Select the trackers to visualize
		</h2>

		<DebouncedTextField
			placeholder="search by imei"
			title="filter by imei"
			class="label mb-4"
			on:change={(e) => ($filters.imei = e.detail)}
		/>

		<DataTable {table} {colspan} isLoading={$query.isLoading} class="mb-2" />

		<Paginator
			select="select min-w-[150px] py-1"
			settings={{
				page: $pagination.page - 1,
				limit: $pagination.pageSize,
				size: $query.data?.itemCount ?? 0,
				amounts: [1, 5, 10, 15]
			}}
			maxNumerals={1}
			showFirstLastButtons
			on:page={({ detail: zeroIndexedPage }) => {
				$pagination.page = zeroIndexedPage + 1;
			}}
			on:amount={({ detail: pageSize }) => {
				$pagination.pageSize = pageSize;
			}}
		/>
	</div>

	<button
		class="btn btn-icon btn-icon-sm variant-filled mx-4 mb-auto"
		on:click={() => drawerStore.close()}
	>
		<Icon icon="mdi:close" />
	</button>
</div>
