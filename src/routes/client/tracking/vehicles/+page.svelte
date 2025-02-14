<script lang="ts">
	import { apiGetVehiclesQuery } from '$lib/api/vehicle.queries';
	import type { GetVehiclesFilters, Vehicle } from '$lib/api/vehicle.schema';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import InfoIconLink from '$lib/components/link/InfoIconLink.svelte';
	import CreateEntityButton from '$lib/components/non-generic/button/CreateEntityButton.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import DataTableFooter from '$lib/components/table/DataTableFooter.svelte';
	import { route } from '$lib/ROUTES';
	import { createPaginationWithFilters } from '$lib/store/data-table.svelte';
	import {
		createSvelteTable,
		getCoreRowModel,
		renderComponent,
		type ColumnDef
	} from '@tanstack/svelte-table';

	const { pagination, filters } = createPaginationWithFilters<GetVehiclesFilters>({});

	const query = apiGetVehiclesQuery(pagination, filters);

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
			accessorKey: 'fleet',
			header: () => 'Fleet',
			cell: ({ row }) => row.original.fleet?.name ?? 'n/a'
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
				renderComponent(InfoIconLink, {
					href: route(`/client/tracking/vehicles/[vehicle_id=integer]`, {
						vehicle_id: row.original.id.toString()
					})
				})
		}
	];

	const table = $derived(
		createSvelteTable({
			data: query.data?.records ?? [],
			columns,
			manualPagination: true,
			state: {
				pagination: {
					pageIndex: pagination.page,
					pageSize: pagination.pageSize
				}
			},
			getCoreRowModel: getCoreRowModel()
		})
	);
</script>

<div class="p-6 max-w-5xl mx-auto">
	<TitleAndBreadCrumbsPageHeader
		title="vehicles"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ text: 'tracking' },
			{ href: route('/client/tracking/vehicles'), icon: 'mdi:car', text: 'vehicles' }
		]}
	/>

	<hr class="hr mt-4 mb-8" />

	<div class="flex mb-4 items-center space-x-4">
		<DebouncedTextField
			placeholder="search by plate"
			classes="w-full"
			onChange={(v) => (filters.plate = v)}
		/>

		<CreateEntityButton
			href={route('/client/tracking/vehicles/new')}
			text="new vehicle"
			requiredPermissions="CREATE_VEHICLE"
		/>
	</div>

	<DataTable {table} isLoading={query.isFetching} />

	<DataTableFooter
		extraClasses="mt-4"
		bind:page={pagination.page}
		bind:pageSize={pagination.pageSize}
		data={query.data?.records}
		count={query.data?.itemCount}
	/>
</div>
