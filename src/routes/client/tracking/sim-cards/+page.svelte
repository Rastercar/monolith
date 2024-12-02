<script lang="ts">
	import { apiGetSimCards, type GetSimCardsFilters } from '$lib/api/sim-card';
	import type { SimCard } from '$lib/api/sim-card.schema';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import InfoIconLink from '$lib/components/link/InfoIconLink.svelte';
	import CreateEntityButton from '$lib/components/non-generic/button/CreateEntityButton.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import { route } from '$lib/ROUTES';
	import Icon from '@iconify/svelte';
	import { Pagination } from '@skeletonlabs/skeleton-svelte';
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
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
		placeholderData: keepPreviousData,
		queryFn: () => apiGetSimCards({ pagination: pagination, filters: filters })
	}));

	const columns: ColumnDef<SimCard>[] = [
		{
			accessorKey: 'phoneNumber',
			header: () => 'Phone'
		},
		{
			accessorKey: 'ssn',
			header: () => 'SSN'
		},
		{
			accessorKey: 'apnAddress',
			header: () => 'APN Address'
		},
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

	// TODO: breadcrumbs should NOT be manually typed, use route meta
</script>

<div class="p-6 max-w-4xl mx-auto">
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

	{#if query.data}
		<div class="flex mt-4 justify-between">
			<select name="size" id="size" class="select max-w-[150px]" bind:value={pagination.pageSize}>
				{#each [5, 10, 15] as v}
					<option value={v}>{v} Items</option>
				{/each}
			</select>

			<!-- TODO: check for console logs on page change or if we should just bind to avoid callbacks -->
			<Pagination
				page={query.data.page}
				pageSize={query.data.pageSize}
				data={query.data.records}
				count={query.data.pageCount}
				onPageChange={(v) => (pagination.page = v.page)}
				onPageSizeChange={(v) => (pagination.pageSize = v.pageSize)}
			>
				{#snippet labelEllipsis()}<Icon icon="mdi:dots-horizontal" class="size-4" />{/snippet}
				{#snippet labelNext()}<Icon icon="mdi:arrow-right" class="size-4" />{/snippet}
				{#snippet labelPrevious()}<Icon icon="mdi:arrow-left" class="size-4" />{/snippet}
				{#snippet labelFirst()}<Icon icon="mdi:first" class="size-4" />{/snippet}
				{#snippet labelLast()}<Icon icon="mdi:last" class="size-4" />{/snippet}
			</Pagination>
		</div>
	{/if}

	<!-- 
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
	/> -->
</div>
