<script lang="ts">
	import { apiGetSimCardsQuery } from '$lib/api/sim-card.queries';
	import type { GetSimCardsFilters, SimCard } from '$lib/api/sim-card.schema';
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

	const { pagination, filters } = createPaginationWithFilters<GetSimCardsFilters>({});

	const query = apiGetSimCardsQuery(pagination, filters);

	const columns: ColumnDef<SimCard>[] = [
		{ accessorKey: 'phoneNumber', header: () => 'Phone' },
		{ accessorKey: 'ssn', header: () => 'SSN' },
		{ accessorKey: 'apnAddress', header: () => 'APN Address' },
		{
			id: 'actions',
			cell: ({ row }) =>
				renderComponent(InfoIconLink, {
					href: route('/client/tracking/sim-cards/[sim_card_id=integer]', {
						sim_card_id: row.original.id.toString()
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
		title="sim cards"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ text: 'tracking' },
			{ href: route('/client/tracking/sim-cards'), icon: 'mdi:sim', text: 'sim cards' }
		]}
	/>

	<hr class="hr mt-4 mb-8" />

	<div class="flex mb-4 items-center space-x-4">
		<DebouncedTextField
			placeholder="search by phone number"
			classes="w-full"
			onChange={(v) => (filters.phoneNumber = v)}
		/>

		<CreateEntityButton
			href={route('/client/tracking/sim-cards/new')}
			text="new sim card"
			requiredPermissions="CREATE_SIM_CARD"
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
