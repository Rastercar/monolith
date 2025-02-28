<script lang="ts">
	import { apiGetFleetsQuery } from '$lib/api/fleet.queries';
	import type { Fleet, GetFleetsFilters } from '$lib/api/fleet.schema';
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
	import DescriptionColumn from './components/DescriptionColumn.svelte';
	import VehicleCountColumn from './components/VehicleCountColumn.svelte';

	const { pagination, filters } = createPaginationWithFilters<GetFleetsFilters>({});

	const query = apiGetFleetsQuery(pagination, filters);

	const columns: ColumnDef<Fleet>[] = [
		{
			accessorKey: 'name',
			header: () => 'Nome'
		},
		{
			accessorKey: 'vehicles',
			header: () => 'Veículos',
			cell: ({ row }) =>
				renderComponent(VehicleCountColumn, { count: row.original.vehicles?.length ?? 0 })
		},
		{
			accessorKey: 'description',
			header: () => 'Descrição',
			cell: ({ row }) =>
				renderComponent(DescriptionColumn, { description: row.original.description })
		},
		{
			id: 'actions',
			cell: ({ row }) =>
				renderComponent(InfoIconLink, {
					href: route(`/client/rastreamento/frotas/[fleet_id=integer]`, {
						fleet_id: row.original.id.toString()
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
		title="frotas"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ text: 'rastreamento' },
			{ href: route('/client/rastreamento/frotas'), icon: 'mdi:car-multiple', text: 'frotas' }
		]}
	/>

	<hr class="hr mt-4 mb-8" />

	<div class="flex mb-4 items-center space-x-4">
		<DebouncedTextField
			placeholder="buscar por nome"
			classes="w-full"
			onChange={(v) => (filters.name = v)}
		/>

		<CreateEntityButton
			href={route('/client/rastreamento/frotas/novo')}
			text="nova frota"
			requiredPermissions="CREATE_FLEET"
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
