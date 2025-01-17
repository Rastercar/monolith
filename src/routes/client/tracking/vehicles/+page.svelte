<script lang="ts">
	import { apiGetVehicles } from '$lib/api/vehicle';
	import type { GetVehiclesFilters, Vehicle } from '$lib/api/vehicle.schema';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import InfoIconLink from '$lib/components/link/InfoIconLink.svelte';
	import CreateEntityButton from '$lib/components/non-generic/button/CreateEntityButton.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import DataTableFooter from '$lib/components/table/DataTableFooter.svelte';
	import { route } from '$lib/ROUTES';
	import { createPaginationWithFilters } from '$lib/store/data-table.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import {
		createSvelteTable,
		getCoreRowModel,
		renderComponent,
		type ColumnDef
	} from '@tanstack/svelte-table';

	const { pagination, filters } = createPaginationWithFilters<GetVehiclesFilters>({});

	const query = createQuery(() => ({
		queryKey: ['vehicles', pagination, filters],
		queryFn: () => apiGetVehicles({ pagination: pagination, filters: filters })
	}));

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
			columns: columns,
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
		data={query.data?.records ?? []}
		count={query.data?.itemCount ?? 0}
	/>
</div>
