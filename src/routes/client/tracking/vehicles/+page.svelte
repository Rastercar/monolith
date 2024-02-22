<script lang="ts">
	import type { Paginated } from '$lib/api/common';
	import { apiGetVehicles, type GetVehiclesFilters } from '$lib/api/vehicle';
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import InfoIconLink from '$lib/components/link/InfoIconLink.svelte';
	import CreateEntityButton from '$lib/components/non-generic/button/CreateEntityButton.svelte';
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
			cell: ({ row }) =>
				renderComponent(InfoIconLink, { href: `/client/tracking/vehicles/${row.original.id}` })
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
	<TitleAndBreadCrumbsPageHeader
		title="vehicles"
		breadCrumbs={[
			{ href: '/client', icon: 'mdi:home', text: 'home' },
			{ text: 'tracking' },
			{ href: '/client/tracking/vehicles', icon: 'mdi:car', text: 'vehicles' }
		]}
	/>

	<hr class="my-4" />

	<div class="flex mb-4 items-center">
		<DebouncedTextField
			placeholder="search by plate"
			title="filter by plate"
			class="label w-full max-w-lg mr-4"
			on:change={(e) => ($filters.plate = e.detail)}
		/>

		<CreateEntityButton
			href="/client/tracking/vehicles/new"
			text="new vehicle"
			requiredPermission="CREATE_VEHICLE"
		/>
	</div>

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
