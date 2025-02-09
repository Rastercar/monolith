<script lang="ts">
	import { apiGetTrackers } from '$lib/api/tracker';
	import type { GetTrackersFilters, Tracker } from '$lib/api/tracker.schema';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import SimpleCheckbox from '$lib/components/input/SimpleCheckbox.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import DataTableFooter from '$lib/components/table/DataTableFooter.svelte';
	import { TRACKER_SUBSCRIPTION_PER_USER_LIMIT } from '$lib/constants/socket-io';
	import { getMapContext } from '$lib/store/context';
	import { createPaginationWithFilters } from '$lib/store/data-table.svelte';
	import { isOnMobileViewPort } from '$lib/store/viewport.svelte';
	import Icon from '@iconify/svelte';
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import {
		createSvelteTable,
		getCoreRowModel,
		renderComponent,
		type ColumnDef,
		type RowSelectionState
	} from '@tanstack/svelte-table';

	interface Props {
		onCloseClick: () => void;
	}

	const { onCloseClick }: Props = $props();

	const mapContext = getMapContext();

	const { pagination, filters } = createPaginationWithFilters<GetTrackersFilters>(
		{ withAssociatedVehicle: false },
		{ page: 1, pageSize: 3 }
	);

	const query = createQuery(() => ({
		queryKey: ['trackers', pagination, filters],
		placeholderData: keepPreviousData,
		queryFn: () => apiGetTrackers({ pagination, filters })
	}));

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
					onChange: (isChecked: boolean) => {
						const tracker = row.original;

						if (!isChecked) {
							delete mapContext.mapSelectedTrackers[tracker.id];
						} else {
							mapContext.mapSelectedTrackers[tracker.id] = tracker;
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

	const getSelectionMap = (): RowSelectionState =>
		Object.values(mapContext.mapSelectedTrackers).reduce(
			(acc, t) => ({ ...acc, [t.id]: true }),
			{}
		);

	const table = $derived(
		createSvelteTable({
			data: query.data?.records ?? [],
			columns,
			manualPagination: true,
			state: {
				rowSelection: getSelectionMap(),
				pagination: {
					pageIndex: pagination.page,
					pageSize: pagination.pageSize
				}
			},
			// Important, use the row item ID as the row ID and not the row IDX,
			// since we still need to known what items are selected even after the
			// dataset changes
			getRowId: (e) => e.id.toString(),
			getCoreRowModel: getCoreRowModel(),
			enableRowSelection: () => !reachedSelectionLimit
		})
	);

	const { isMobileViewport } = isOnMobileViewPort();

	let selectedTrackersCnt = $derived(Object.keys(mapContext.mapSelectedTrackers).length);
	let reachedSelectionLimit = $derived(selectedTrackersCnt >= TRACKER_SUBSCRIPTION_PER_USER_LIMIT);
</script>

<div class="flex justify-center">
	<div class="w-full max-w-2xl p-4">
		<h2 class="flex items-center mb-4 type-scale-6">
			<Icon icon="mdi:satellite" class="mr-2 hidden md:block" height={32} />
			Trackers to show

			{#if reachedSelectionLimit}
				<span class="ml-auto flex items-center bg-warning-200-800 p-2 rounded-md type-scale-1">
					<Icon icon="mdi:warning" class="mr-2" />
					cannot select over {TRACKER_SUBSCRIPTION_PER_USER_LIMIT} trackers
				</span>
			{/if}

			<Icon icon="mdi:close" onclick={onCloseClick} class="ml-auto" height={32} />
		</h2>

		<DebouncedTextField placeholder="search by imei" onChange={(v) => (filters.imei = v)} />

		<DataTable classes="mt-4" {table} isLoading={query.isFetching} />

		<DataTableFooter
			extraClasses="mt-4"
			bind:page={pagination.page}
			bind:pageSize={pagination.pageSize}
			data={query.data?.records ?? []}
			count={query.data?.itemCount ?? 0}
			withPageSizeSelector={false}
			alternativePagination={isMobileViewport}
		/>

		<div class="flex items-center mt-4">
			<span class="mr-auto">
				{selectedTrackersCnt || 'no'} selected trackers
			</span>

			<button
				class="btn btn-sm preset-filled-primary-200-800"
				onclick={() => (mapContext.mapSelectedTrackers = {})}
			>
				clear all
				<Icon icon="mdi:trash" />
			</button>
		</div>
	</div>
</div>
