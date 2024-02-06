<script lang="ts">
	import type { Paginated } from '$lib/api/common';
	import { apiGetVehicles } from '$lib/api/vehicle';
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import SimpleCheckbox from '$lib/components/input/SimpleCheckbox.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import { getToaster } from '$lib/store/toaster';
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

	const pagination = writable({ page: 1, pageSize: 5 });

	const query = createQuery(
		derived([pagination], ([$pagination]) => ({
			queryKey: ['vehicles', $pagination],
			placeholderData: keepPreviousData,
			queryFn: async (): Promise<Paginated<Vehicle>> => {
				const result = await apiGetVehicles({ ...$pagination });

				// since we are doing server side pagination, we need to
				// clear the row selection since the dataset changes bellow
				$table.resetRowSelection();

				$options.data = result.records;

				return result;
			}
		}))
	);

	// TODO: check nullable fields and think about placeholders
	// TODO: think about responsiveness
	const columns: ColumnDef<Vehicle>[] = [
		{
			accessorKey: 'model',
			header: () => 'Model'
		},
		{
			accessorKey: 'plate',
			header: () => 'Plate'
		},
		{
			accessorKey: 'brand',
			header: () => 'Brand'
		},
		{
			accessorKey: 'color',
			header: () => 'Color'
		},
		{
			accessorKey: 'chassisNumber',
			header: () => 'Chassis'
		},
		{
			// TODO: join years
			accessorKey: 'fabricationYear',
			header: () => 'Fab Year'
		},
		{
			// TODO:
			accessorKey: 'modelYear',
			header: () => 'Model Year'
		},
		{
			accessorKey: 'createdAt',
			header: () => 'Created at',
			cell: ({ cell }) => new Date(cell.row.original.createdAt).toLocaleDateString()
		},
		{
			// TODO: actions column (details link ? etc)
			id: 'actions',
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

	const options = writable<TableOptions<Vehicle>>({
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

	const toaster = getToaster();

	const table = createSvelteTable(options);

	$: isLoading = $query.isLoading || $query.isFetching;
</script>

<DataTable {table} {colspan} {isLoading} class="mb-4" />

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
