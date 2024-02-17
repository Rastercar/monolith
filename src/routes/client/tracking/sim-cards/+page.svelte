<script lang="ts">
	import type { Paginated } from '$lib/api/common';
	import { apiGetSimCards, type GetSimCardsFilters } from '$lib/api/sim-card';
	import type { SimCard } from '$lib/api/sim-card.schema';
	import PermissionGuard from '$lib/components/guard/permission-guard.svelte';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import InfoIconLink from '$lib/components/link/InfoIconLink.svelte';
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

	const pagination = writable({ page: 1, pageSize: 5 });

	const filters = writable<GetSimCardsFilters>({});

	const query = createQuery(
		derived([pagination, filters], ([$pagination, $filters]) => ({
			queryKey: ['sim-cards', $pagination, $filters],
			placeholderData: keepPreviousData,
			queryFn: async (): Promise<Paginated<SimCard>> => {
				const result = await apiGetSimCards({ pagination: $pagination, filters: $filters });

				$options.data = result.records;

				return result;
			}
		}))
	);

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
			// TODO: info page
			cell: ({ row }) =>
				renderComponent(InfoIconLink, { href: `/client/tracking/sim-cards/${row.original.id}` })
		}
	];

	const colspan = columns.length;

	const options = writable<TableOptions<SimCard>>({
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
		title="sim cards"
		breadCrumbs={[
			{ href: '/client', icon: 'mdi:home', text: 'home' },
			{ text: 'tracking' },
			{ href: '/client/tracking/sim-cards', icon: 'mdi:sim', text: 'sim cards' }
		]}
	/>

	<hr class="my-4" />

	<div class="flex mb-4 items-center">
		<DebouncedTextField
			placeholder="search by phone number"
			title="filter by phone number"
			class="label w-full max-w-lg mr-4"
			on:change={(e) => ($filters.phoneNumber = e.detail)}
		/>

		<!-- TODO: creating page -->
		<PermissionGuard requiredPermissions={['CREATE_SIM_CARD']}>
			<a href="/client/tracking/sim-cards/new" class="ml-auto">
				<button class="btn variant-filled-primary">
					<Icon icon="mdi:plus" class="mr-1" />
					new sim card
				</button>
			</a>
		</PermissionGuard>
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
			const itemCount = $query.data?.itemCount || 0;
			$pagination.pageSize = pageSize;
		}}
	/>
</div>
