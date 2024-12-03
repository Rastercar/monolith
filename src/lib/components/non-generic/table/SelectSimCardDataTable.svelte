<!-- 
  @component
  Simple data table for selecting a SIM card that is not associated with a tracker
-->
<script lang="ts">
	import { apiGetSimCards, type GetSimCardsFilters } from '$lib/api/sim-card';
	import type { SimCard } from '$lib/api/sim-card.schema';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import SimpleCheckbox from '$lib/components/input/SimpleCheckbox.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import DataTableFooter from '$lib/components/table/DataTableFooter.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import {
		createSvelteTable,
		getCoreRowModel,
		renderComponent,
		type ColumnDef,
		type RowSelectionState
	} from '@tanstack/svelte-table';

	interface Props {
		/**
		 * The ID of the tracker to associate the selected SIM card to
		 */
		trackerIdToAssociate: number;

		onSelected: (_: SimCard) => void;
	}

	let { trackerIdToAssociate, onSelected }: Props = $props();

	// TODO: it seems tanstack table for svelte 5 is quite buggy
	//
	// and we need to declare and manage row selection state ourselves
	let rowSelection = $state<RowSelectionState>({});

	const pagination = $state({ page: 1, pageSize: 5 });

	const filters = $state<GetSimCardsFilters>({ withAssociatedTracker: false });

	const query = createQuery(() => ({
		queryKey: ['sim-cards', pagination, filters],
		queryFn: async () => {
			const result = await apiGetSimCards({ pagination: pagination, filters: filters });
			rowSelection = {};

			return result;
		}
	}));

	// queryFn: async (): Promise<Paginated<SimCard>> => {
	// 		const result = await apiGetSimCards({ pagination: $pagination, filters: $filters });
	// 		// since we are doing server side pagination, we need to
	// 		// clear the row selection since the dataset changes bellow
	// 		$table.resetRowSelection();
	// 		$options.data = result.records;
	// 		return result;
	// }

	const columns: ColumnDef<SimCard>[] = [
		{ accessorKey: 'phoneNumber', header: () => 'Phone' },
		{ accessorKey: 'ssn', header: () => 'SSN' },
		{ accessorKey: 'apnAddress', header: () => 'APN' },
		{
			accessorKey: 'createdAt',
			header: () => 'Created at',
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
			columns: columns,
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

	// const mutation = createMutation({
	// 	mutationFn: (simCardId: number) =>
	// 		apiSetSimCardTracker({ simCardId, newTrackerId: trackerIdToAssociate }),

	// 	onError: () => toaster.error('failed to add SIM card to tracker')
	// });

	// const addSimToTracker = () => {
	// 	const selectedRowId = Object.keys($table.getState().rowSelection)[0];
	// 	const simCard = $table.getRow(selectedRowId).original;

	// 	$mutation.mutateAsync(simCard.id).then(() => {
	// 		dispatch('sim-card-selected', simCard);
	// 	});
	// };

	// const showSimInfoModal = () => {
	// 	modalStore.trigger({
	// 		type: 'alert',
	// 		title: 'About available SIM cards',
	// 		body: 'Only SIM cards that are not associated with a tracker can be selected, if you wish to use a SIM card that is already installed in a tracker, please uninstall the SIM card.',
	// 		buttonTextCancel: 'ok'
	// 	});
	// };

	let hasSelectedItem = $derived(Object.keys($table.getState().rowSelection).length > 0);
</script>

<pre>{JSON.stringify(rowSelection, null, 2)}</pre>
<pre>{JSON.stringify($table.getState().rowSelection, null, 2)}</pre>

<DebouncedTextField
	classes="label my-4"
	placeholder="Filter by phone number"
	onChange={(v) => (filters.phoneNumber = v)}
>
	{#snippet label()}
		<div class="flex">
			<span>Filter by phone number</span>
			<button type="button" class="btn p-0 text-primary-800-200 ml-auto">
				<!-- TODO: -->
				<!-- onclick={showSimInfoModal} -->
				not finding your sim card ?
			</button>
		</div>
	{/snippet}
</DebouncedTextField>

<DataTable {table} isLoading={query.isFetching} />

<DataTableFooter
	extraClasses="mt-4"
	bind:page={pagination.page}
	bind:pageSize={pagination.pageSize}
	data={query.data?.records ?? []}
	count={query.data?.itemCount ?? 0}
/>

{#if hasSelectedItem}
	<div class="flex justify-end mt-4">
		<!-- onclick={addSimToTracker} -->
		<button class="btn preset-filled-primary-500">Select SIM card</button>
	</div>
{/if}
