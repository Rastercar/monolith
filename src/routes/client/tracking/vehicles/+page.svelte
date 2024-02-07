<script lang="ts">
	import type { Paginated } from '$lib/api/common';
	import { apiGetVehicles, type GetVehiclesFilters } from '$lib/api/vehicle';
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import Breadcrumbs from '$lib/components/breadcrumbs/BreadCrumbs.svelte';
	import PermissionGuard from '$lib/components/guard/permission-guard.svelte';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import Icon from '@iconify/svelte';
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
	import VehicleActionColumn from './components/VehicleActionColumn.svelte';

	const pagination = writable({ page: 1, pageSize: 5 });

	const filters = writable<GetVehiclesFilters>({});

	const query = createQuery(
		derived([pagination, filters], ([$pagination, $filters]) => ({
			queryKey: ['vehicles', $pagination, $filters],
			placeholderData: keepPreviousData,
			queryFn: async (): Promise<Paginated<Vehicle>> => {
				const result = await apiGetVehicles({ pagination: $pagination, filters: $filters });

				$options.data = result.records;

				return result;
			}
		}))
	);

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
			id: 'fabricationAndModelYear',
			header: () => 'Year',
			cell: ({ row }) =>
				`${row.original.fabricationYear ?? '0000'} / ${row.original.modelYear ?? '0000'}`
		},
		{
			accessorKey: 'chassisNumber',
			header: () => 'Chassis'
		},
		{
			id: 'actions',
			cell: ({ row }) => renderComponent(VehicleActionColumn, { vehicleId: row.original.id })
		}
	];

	const colspan = columns.length;

	const options = writable<TableOptions<Vehicle>>({
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

<div class="p-6 max-w-4xl mx-auto">
	<div class="flex mb-4 items-center">
		<h1 class="h2 mr-auto">vehicles</h1>

		<div class="ml-auto">
			<Breadcrumbs
				breadCrumbs={[
					{ href: '/client', icon: 'mdi:home', text: 'home' },
					{ text: 'tracking' },
					{ href: '/client/tracking/vehicles', icon: 'mdi:car', text: 'vehicles' }
				]}
			/>
		</div>
	</div>

	<hr class="my-4" />

	<div class="flex mb-4 items-center">
		<DebouncedTextField
			placeholder="search by plate"
			title="filter by plate"
			class="label w-full max-w-lg mr-4"
			on:change={(e) => ($filters.plate = e.detail)}
		/>

		<PermissionGuard requiredPermissions={['CREATE_VEHICLE']}>
			<a href="/client/tracking/vehicles/new" class="ml-auto">
				<button class="btn variant-filled-primary">
					<Icon icon="mdi:plus" class="mr-1" />
					new vehicle
				</button>
			</a>
		</PermissionGuard>
	</div>

	<DataTable {table} {colspan} isLoading={$query.isLoading} class="mb-4" />

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
