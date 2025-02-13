<script lang="ts">
	import { apiGetAccessLevels } from '$lib/api/access-level';
	import type { AccessLevel, GetAccessLevelFilters } from '$lib/api/access-level.schema';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import InfoIconLink from '$lib/components/link/InfoIconLink.svelte';
	import CreateEntityButton from '$lib/components/non-generic/button/CreateEntityButton.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import DataTableFooter from '$lib/components/table/DataTableFooter.svelte';
	import { route } from '$lib/ROUTES';
	import { createPaginationWithFilters } from '$lib/store/data-table.svelte';
	import { toDateTime } from '$lib/utils/date';
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import {
		createSvelteTable,
		getCoreRowModel,
		renderComponent,
		type ColumnDef
	} from '@tanstack/svelte-table';

	const { pagination, filters } = createPaginationWithFilters<GetAccessLevelFilters>({});

	const query = createQuery(() => ({
		queryKey: ['vehicles', pagination, filters],
		queryFn: () => apiGetAccessLevels({ pagination: pagination, filters: filters }),
		placeholderData: keepPreviousData
	}));

	const columns: ColumnDef<AccessLevel>[] = [
		{
			accessorKey: 'name',
			header: () => 'Name'
		},
		{
			accessorKey: 'description',
			header: () => 'Description'
		},
		{
			accessorKey: 'createdAt',
			header: () => 'Created At',
			cell: ({ row }) => toDateTime(row.original.createdAt)
		},
		{
			id: 'actions',
			cell: ({ row }) =>
				renderComponent(InfoIconLink, {
					href: route(`/client/access-levels/[access_level_id=integer]`, {
						access_level_id: row.original.id.toString()
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
		title="access levels"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ href: route('/client/access-levels'), icon: 'mdi:shield', text: 'access levels' }
		]}
	/>

	<hr class="hr mt-4 mb-8" />

	<div class="flex mb-4 items-center space-x-4">
		<DebouncedTextField
			placeholder="search by name"
			classes="w-full"
			onChange={(v) => (filters.name = v)}
		/>

		<CreateEntityButton
			href={route('/client/access-levels/new')}
			text="new access level"
			requiredPermissions="MANAGE_USER_ACCESS_LEVELS"
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
