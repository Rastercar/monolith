<script lang="ts">
	import { apiGetTrackersQuery } from '$lib/api/tracker.queries';
	import type { GetTrackersFilters, Tracker } from '$lib/api/tracker.schema';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import SimpleCheckbox from '$lib/components/input/SimpleCheckbox.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import DataTableFooter from '$lib/components/table/DataTableFooter.svelte';
	import { createPaginationWithFilters } from '$lib/store/data-table.svelte';
	import {
		createSvelteTable,
		getCoreRowModel,
		renderComponent,
		type ColumnDef,
		type RowSelectionState
	} from '@tanstack/svelte-table';
	import { Popover } from 'bits-ui';
	import type { Snippet } from 'svelte';

	interface Props {
		bottomRight?: Snippet<[{ isLoading: boolean; selectedTracker: Tracker | null }]>;
	}

	const { bottomRight }: Props = $props();

	const { pagination, filters } = createPaginationWithFilters<GetTrackersFilters>({
		withAssociatedVehicle: false
	});

	let rowSelection = $state<RowSelectionState>({});

	const query = apiGetTrackersQuery(pagination, filters, { refetchOnWindowFocus: false });

	$effect(() => {
		if (query.isFetching) rowSelection = {};
	});

	const columns: ColumnDef<Tracker>[] = [
		{
			accessorKey: 'model',
			header: () => 'Modelo'
		},
		{
			accessorKey: 'imei',
			header: () => 'IMEI'
		},
		{
			accessorKey: 'createdAt',
			header: () => 'Data de cadastro',
			cell: ({ cell }) => new Date(cell.row.original.createdAt).toLocaleDateString()
		},
		{
			id: 'selector',
			cell: (cell) =>
				renderComponent(SimpleCheckbox, {
					checked: cell.row.getIsSelected(),
					disabled: !cell.row.getCanSelect(),
					indeterminate: cell.row.getIsSomeSelected(),
					onChange: (a) => (rowSelection = { [cell.row.id]: a })
				})
		}
	];

	const table = $derived(
		createSvelteTable({
			data: query.data?.records ?? [],
			columns,
			manualPagination: true,
			enableRowSelection: true,
			enableMultiRowSelection: false,
			state: {
				rowSelection,
				pagination: {
					pageIndex: pagination.page,
					pageSize: pagination.pageSize
				}
			},
			getCoreRowModel: getCoreRowModel()
		})
	);

	let selectedTracker = $derived.by(() => {
		const selectedRow = Object.entries(rowSelection).find(([_, isSelected]) => isSelected);

		if (!selectedRow) return null;

		const rowId = selectedRow[0];
		return $table.getRow(rowId).original;
	});
</script>

<DebouncedTextField
	classes="label my-4"
	placeholder="Filtrar por IMEI"
	onChange={(v) => (filters.imei = v)}
/>

<DataTable {table} isLoading={query.isFetching} />

<DataTableFooter
	extraClasses="mt-4"
	bind:page={pagination.page}
	bind:pageSize={pagination.pageSize}
	data={query.data?.records}
	count={query.data?.itemCount}
/>

<div class="flex justify-between items-center">
	<Popover.Root>
		<Popover.Trigger>
			<button type="button" class="btn p-0 text-primary-800-200 ml-auto">
				não está encontrando seu rastreador?
			</button>
		</Popover.Trigger>

		<Popover.Portal>
			<Popover.Content
				class="z-30 max-w-96 rounded-lg bg-surface-200-800 p-4 shadow-lg"
				align="end"
				sideOffset={8}
			>
				<p>
					Somente rastreadores não associados a um veículo podem ser selecionados, se deseja
					utilizar um rastreador já instalado em um veículo desinstale-o primeiro.
				</p>
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>

	{#if bottomRight}
		{@render bottomRight({ isLoading: query.isFetching, selectedTracker })}
	{/if}
</div>
