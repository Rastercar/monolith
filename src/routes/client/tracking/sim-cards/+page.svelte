<script lang="ts">
	import { apiGetSimCards } from '$lib/api/sim-card';
	import type { GetSimCardsFilters, SimCard } from '$lib/api/sim-card.schema';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import InfoIconLink from '$lib/components/link/InfoIconLink.svelte';
	import CreateEntityButton from '$lib/components/non-generic/button/CreateEntityButton.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import DataTableFooter from '$lib/components/table/DataTableFooter.svelte';
	import { route } from '$lib/ROUTES';
	import { createQuery } from '@tanstack/svelte-query';
	import {
		createSvelteTable,
		getCoreRowModel,
		renderComponent,
		type ColumnDef
	} from '@tanstack/svelte-table';

	const pagination = $state({ page: 1, pageSize: 5 });

	const filters = $state<GetSimCardsFilters>({});

	const query = createQuery(() => ({
		queryKey: ['sim-cards', pagination, filters],
		queryFn: () => apiGetSimCards({ pagination: pagination, filters: filters })
	}));

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
		data={query.data?.records ?? []}
		count={query.data?.itemCount ?? 0}
	/>
</div>
