<!-- 
  @component
  Simple data table for selecting a SIM card that is not associated with a tracker
-->
<script lang="ts">
	import type { Paginated } from '$lib/api/common';
	import { apiGetSimCards, apiSetSimCardTracker, type GetSimCardsFilters } from '$lib/api/sim-card';
	import type { SimCard } from '$lib/api/sim-card.schema';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import SimpleCheckbox from '$lib/components/input/SimpleCheckbox.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import { getToaster } from '$lib/store/toaster';
	import { getModalStore, Paginator } from '@skeletonlabs/skeleton';
	import { createMutation, createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import {
		createSvelteTable,
		getCoreRowModel,
		renderComponent,
		type ColumnDef,
		type TableOptions
	} from '@tanstack/svelte-table';
	import { createEventDispatcher } from 'svelte';
	import { derived, writable } from 'svelte/store';

	/**
	 * The ID of the tracker to associate the selected SIM card to
	 */
	export let trackerIdToAssociate: number;

	const pagination = writable({ page: 1, pageSize: 3 });
	const filters = writable<GetSimCardsFilters>({ withAssociatedTracker: false });

	const query = createQuery(
		derived([pagination, filters], ([$pagination, $filters]) => ({
			queryKey: ['sim-cards', $pagination, $filters],
			placeholderData: keepPreviousData,
			queryFn: async (): Promise<Paginated<SimCard>> => {
				const result = await apiGetSimCards({ pagination: $pagination, filters: $filters });

				// since we are doing server side pagination, we need to
				// clear the row selection since the dataset changes bellow
				$table.resetRowSelection();

				$options.data = result.records;

				return result;
			}
		}))
	);

	const columns: ColumnDef<SimCard>[] = [
		{
			accessorKey: 'phoneNumber',
			header: () => 'Phone'
		},
		{
			accessorKey: 'ssn',
			header: () => 'SSN'
		},
		{
			accessorKey: 'apnAddress',
			header: () => 'APN'
		},
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
					onChange: cell.row.getToggleSelectedHandler()
				})
		}
	];

	const colspan = columns.length;

	const options = writable<TableOptions<SimCard>>({
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

	const mutation = createMutation({
		mutationFn: (simCardId: number) =>
			apiSetSimCardTracker({ simCardId, newTrackerId: trackerIdToAssociate }),

		onError: () => toaster.error('failed to add SIM card to tracker')
	});

	const dispatch = createEventDispatcher<{ 'sim-card-selected': SimCard }>();

	const addSimToTracker = () => {
		const selectedRowId = Object.keys($table.getState().rowSelection)[0];
		const simCard = $table.getRow(selectedRowId).original;

		$mutation.mutateAsync(simCard.id).then(() => {
			dispatch('sim-card-selected', simCard);
		});
	};

	const modalStore = getModalStore();

	const showSimInfoModal = () => {
		modalStore.trigger({
			type: 'alert',
			title: 'About available SIM cards',
			body: 'Only SIM cards that are not associated with a tracker can be selected, if you wish to use a SIM card that is already installed in a tracker, please uninstall the SIM card.',
			buttonTextCancel: 'ok'
		});
	};

	$: isLoading = $query.isLoading || $query.isFetching;

	$: hasSelectedItem = Object.keys($table.getState().rowSelection).length > 0;
</script>

<DebouncedTextField
	class="label my-4"
	title="Filter by phone number"
	on:change={(e) => ($filters.phoneNumber = e.detail)}
>
	<div slot="label" class="flex">
		<span>Filter by phone number</span>
		<button
			type="button"
			class="btn p-0 text-primary-700-200-token ml-auto"
			on:click={showSimInfoModal}
		>
			not finding your sim card ?
		</button>
	</div>
</DebouncedTextField>

<DataTable {table} {colspan} {isLoading} class="mb-4" />

<Paginator
	select="select min-w-[150px] py-1"
	settings={{
		page: $pagination.page - 1,
		limit: $pagination.pageSize,
		size: $query.data?.itemCount ?? 0,
		amounts: [1, 3, 5, 10, 15]
	}}
	maxNumerals={1}
	on:page={({ detail: zeroIndexedPage }) => {
		$pagination.page = zeroIndexedPage + 1;
	}}
	on:amount={({ detail: pageSize }) => {
		$pagination.pageSize = pageSize;
	}}
/>

{#if hasSelectedItem}
	<div class="flex justify-end mt-4">
		<button class="btn variant-filled-primary" on:click={addSimToTracker}>Select SIM card</button>
	</div>
{/if}
