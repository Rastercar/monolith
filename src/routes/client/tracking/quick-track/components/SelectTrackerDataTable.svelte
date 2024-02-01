<script lang="ts">
	import type { Paginated } from '$lib/api/common';
	import { apiGetTrackers, type GetTrackersFilters } from '$lib/api/tracker';
	import type { Tracker } from '$lib/api/tracker.schema';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import { Paginator } from '@skeletonlabs/skeleton';
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import {
		createSvelteTable,
		getCoreRowModel,
		renderComponent,
		type ColumnDef,
		type TableOptions
	} from '@tanstack/svelte-table';
	import { derived, writable } from 'svelte/store';
	import StepperNav from './StepperNav.svelte';
	import TableCheckbox from './TableCheckbox.svelte';

	const pagination = writable({ page: 1, pageSize: 5 });
	const filters = writable<GetTrackersFilters>({ withAssociatedVehicle: false });

	const query = createQuery(
		derived([pagination, filters], ([$pagination, $filters]) => ({
			queryKey: ['trackers', $pagination, $filters],
			placeholderData: keepPreviousData,
			queryFn: async (): Promise<Paginated<Tracker>> => {
				const result = await apiGetTrackers({ pagination: $pagination, filters: $filters });

				// since we are doing server side pagination, we need to
				// clear the row selection since the dataset changes bellow
				$table.resetRowSelection();

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
			accessorKey: 'createdAt',
			header: () => 'Created at',
			cell: ({ cell }) => new Date(cell.row.original.createdAt).toLocaleDateString()
		},
		{
			id: 'selector',
			header: '',
			cell: (cell) =>
				renderComponent(TableCheckbox, {
					checked: cell.row.getIsSelected(),
					disabled: !cell.row.getCanSelect(),
					indeterminate: cell.row.getIsSomeSelected(),
					onChange: cell.row.getToggleSelectedHandler()
				})
		}
	];

	const colspan = columns.length;

	const options = writable<TableOptions<Tracker>>({
		data: $query.data?.records ?? [],
		columns: columns,
		manualPagination: true,
		enableRowSelection: true,
		enableMultiRowSelection: false,
		state: {
			pagination: {
				pageIndex: $pagination.page,
				pageSize: $pagination.pageSize
			}
		},
		getCoreRowModel: getCoreRowModel()
	});

	const table = createSvelteTable(options);

	$: isLoading = $query.isLoading || $query.isFetching;
</script>

<p class="text-sm mb-4">Select bellow the tracker to use</p>

<hr />

<DebouncedTextField
	class="label my-4"
	label="Filter by IMEI"
	title="Filter by IMEI"
	on:change={(e) => ($filters.imei = e.detail)}
/>

<DataTable {table} {colspan} {isLoading} class="mb-2" />

<Paginator
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

<StepperNav
	class="mt-4"
	canSubmit={Object.keys($table.getState().rowSelection).length > 0}
	{isLoading}
	on:click={() => {
		// TODO: now we need to call the set tracker vehicle API and proceed to the next step !
		const selectedRowId = Object.keys($table.getState().rowSelection)[0];
		const trackerId = $table.getRow(selectedRowId).original;

		console.log(trackerId);
	}}
/>
