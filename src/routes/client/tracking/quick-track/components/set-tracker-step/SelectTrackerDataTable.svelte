<script lang="ts">
	import type { Paginated } from '$lib/api/common';
	import { apiGetTrackers, apiSetTrackerVehicle, type GetTrackersFilters } from '$lib/api/tracker';
	import type { Tracker } from '$lib/api/tracker.schema';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import SimpleCheckbox from '$lib/components/input/SimpleCheckbox.svelte';
	import type { StepperState } from '$lib/components/stepper/types';
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
	import { createEventDispatcher, getContext } from 'svelte';
	import { derived, writable, type Writable } from 'svelte/store';
	import StepperNav from '../StepperNav.svelte';

	/**
	 * The ID of the vehicle to associate the selected tracker to
	 */
	export let vehicleIdToAssociate: number;

	const pagination = writable({ page: 1, pageSize: 5 });
	const filters = writable<GetTrackersFilters>({ withAssociatedVehicle: false });

	let stepperState: Writable<StepperState> = getContext('state');

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

	const toaster = getToaster();

	const table = createSvelteTable(options);

	const mutation = createMutation({
		mutationFn: (trackerId: number) =>
			apiSetTrackerVehicle({ vehicleId: vehicleIdToAssociate, trackerId }),

		onError: () => toaster.error()
	});

	const dispatch = createEventDispatcher<{ 'tracker-selected': Tracker }>();

	const onNextStepClick = () => {
		const selectedRowId = Object.keys($table.getState().rowSelection)[0];
		const tracker = $table.getRow(selectedRowId).original;

		$mutation.mutateAsync(tracker.id).then(() => {
			dispatch('tracker-selected', tracker);
			$stepperState.current++;
		});
	};

	const modalStore = getModalStore();

	const showTrackerInfoModal = () => {
		modalStore.trigger({
			type: 'alert',
			title: 'About available trackers',
			body: 'Only trackers that are not associated with a vehicle can be selected, if you wish to use a tracker that is already installed in a vehicle, please uninstall the tracker.',
			buttonTextCancel: 'ok'
		});
	};

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

<div class="flex justify-between">
	<button
		type="button"
		class="btn !bg-transparent p-0 text-surface-700-200-token"
		on:click={showTrackerInfoModal}
	>
		not finding your tracker ?
	</button>

	<StepperNav
		class="mt-4"
		canSubmit={Object.keys($table.getState().rowSelection).length > 0}
		{isLoading}
		on:click={onNextStepClick}
	/>
</div>
