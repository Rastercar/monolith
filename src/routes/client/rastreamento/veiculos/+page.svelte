<script lang="ts">
	import { apiGetVehiclesQuery } from '$lib/api/vehicle.queries';
	import type { GetVehiclesFilters, Vehicle } from '$lib/api/vehicle.schema';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
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
			header: () => 'Modelo'
		},
		{
			accessorKey: 'plate',
			header: () => 'Placa'
		},
		{
			accessorKey: 'brand',
			header: () => 'Marca'
		},
		{
			accessorKey: 'color',
			header: () => 'Cor'
		},
		{
			accessorKey: 'fleet',
			header: () => 'Frota',
			cell: ({ row }) => row.original.fleet?.name ?? 'n/a'
		},
		{
			id: 'fabricationAndModelYear',
			header: () => 'Ano',
			cell: ({ row }) =>
				`${row.original.fabricationYear ?? '0000'} / ${row.original.modelYear ?? '0000'}`
		},
		{
			accessorKey: 'chassisNumber',
			header: () => 'Chassi'
		},
		{
			id: 'actions',
			cell: ({ row }) =>
				renderComponent(InfoIconLink, {
					href: route(`/client/rastreamento/veiculos/[vehicle_id=integer]`, {
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

<PageContainer>
	<PageHeader
		title="vehicles"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ text: 'rastreamento' },
			{ href: route('/client/rastreamento/veiculos'), icon: 'mdi:car', text: 'veículos' }
		]}
	/>

	<hr class="hr mt-4 mb-8" />

	<div class="flex mb-4 items-center space-x-4">
		<DebouncedTextField
			placeholder="buscar por placa"
			classes="w-full"
			onChange={(v) => (filters.plate = v)}
		/>

		<CreateEntityButton
			href={route('/client/rastreamento/veiculos/novo')}
			text="novo veículo"
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
</PageContainer>
