<script lang="ts">
	import type { Paginated } from '$lib/api/common';
	import { apiGetTrackers, type GetTrackersFilters } from '$lib/api/tracker';
	import type { Tracker } from '$lib/api/tracker.schema';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import Icon from '@iconify/svelte';
	import { Paginator } from '@skeletonlabs/skeleton';
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import {
		type ColumnDef,
		type TableOptions,
		createSvelteTable,
		getCoreRowModel,
		renderComponent,
		type RowSelectionState
	} from '@tanstack/svelte-table';
	import { derived, writable } from 'svelte/store';
	import SimpleCheckbox from '$lib/components/input/SimpleCheckbox.svelte';
	import { selectedTrackerStore } from '../map';
	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/motion';

	/** maximun amount of trackers that can be selected */
	const trackerSelectionLimit = 20;

	// if the window is bigger than the tailwind "md" breakpoint
	// then show 5 items per page, otherwise just 3 to make the table fit
	const pagination = writable({ page: 1, pageSize: window.innerWidth > 768 ? 5 : 3 });

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
			id: 'selector',
			cell: ({ row }) => {
				const isSelected = row.getIsSelected();

				return renderComponent(SimpleCheckbox, {
					checked: isSelected,
					// if the row is selected, allow to unselect
					disabled: isSelected ? false : !row.getCanSelect(),
					indeterminate: false,
					onChange: (e: Event) => {
						const isChecked = (e.target as HTMLInputElement).checked;

						const tracker = row.original;

						if (!isChecked) {
							delete $selectedTrackerStore[tracker.id];
							$selectedTrackerStore = $selectedTrackerStore;
						} else {
							$selectedTrackerStore[tracker.id] = tracker;
							$selectedTrackerStore = $selectedTrackerStore;
						}
					}
				});
			}
		},
		{
			accessorKey: 'imei',
			header: () => 'IMEI'
		}
	];

	let unsubscribeFromMapStoreChanges: Unsubscriber | null = null;

	const getSelectionMap = (): RowSelectionState =>
		Object.values($selectedTrackerStore).reduce((acc, t) => ({ ...acc, [t.id]: true }), {});

	const options = writable<TableOptions<Tracker>>({
		data: $query.data?.records ?? [],
		columns: columns,
		manualPagination: true,
		state: {
			// initialize the data table with the selected trackers from the mapStore
			rowSelection: getSelectionMap(),
			pagination: {
				pageIndex: $pagination.page,
				pageSize: $pagination.pageSize
			}
		},

		// Important, use the row item ID as the row ID and not the row IDX,
		// since we still need to known what items are selected even after the
		// dataset changes
		getRowId: (e) => e.id.toString(),
		getCoreRowModel: getCoreRowModel(),
		enableRowSelection: () => selectionEnabled
	});

	const table = createSvelteTable(options);

	onMount(() => {
		unsubscribeFromMapStoreChanges = selectedTrackerStore.subscribe(() => {
			options.update(({ state: oldState, ...rest }) => ({
				...rest,
				state: { ...oldState, rowSelection: getSelectionMap() }
			}));
		});
	});

	onDestroy(() => {
		if (unsubscribeFromMapStoreChanges) unsubscribeFromMapStoreChanges();
	});

	$: selectedTrackersCount = Object.keys($selectedTrackerStore).length;
	$: selectionEnabled = selectedTrackersCount < trackerSelectionLimit;
</script>

<div class="flex justify-between">
	<div class="mx-auto w-full max-w-2xl p-4">
		<h2 class="flex items-center mb-4 text-2xl mx-auto">
			<Icon icon="mdi:satellite" class="mr-2" height={36} />
			Trackers to show

			{#if !selectionEnabled}
				<span class="ml-auto flex items-center bg-warning-500 p-2 rounded-md text-sm">
					<Icon icon="mdi:warning" class="mr-2" />
					cannot select over {trackerSelectionLimit} trackers
				</span>
			{/if}
		</h2>

		<DebouncedTextField
			placeholder="search by imei"
			title="filter by imei"
			class="label mb-4"
			on:change={(e) => ($filters.imei = e.detail)}
		/>

		<DataTable
			{table}
			colspan={columns.length}
			isLoading={$query.isLoading}
			class="mb-4"
			overflowX=""
		/>

		<Paginator
			select="select min-w-[150px] py-1 hidden md:block"
			settings={{
				page: $pagination.page - 1,
				limit: $pagination.pageSize,
				size: $query.data?.itemCount ?? 0,
				amounts: [1, 3, 5, 10, 15]
			}}
			maxNumerals={3}
			showFirstLastButtons
			on:page={({ detail: zeroIndexedPage }) => {
				$pagination.page = zeroIndexedPage + 1;
			}}
			on:amount={({ detail: pageSize }) => {
				$pagination.pageSize = pageSize;
			}}
		/>

		<div class="flex items-center mt-4">
			<span class="mr-auto">
				{selectedTrackersCount || 'no'} selected trackers
			</span>

			<button
				class="btn btn-sm variant-filled-primary"
				on:click={() => ($selectedTrackerStore = {})}
			>
				<Icon icon="mdi:trash" class="mr-1" />
				clear all
			</button>
		</div>
	</div>
</div>
