<script lang="ts">
	import { apiGetAccessLevels, type GetAccessLevelsFilters } from '$lib/api/access-level';
	import { type AccessLevel } from '$lib/api/access-level.schema';
	import type { Paginated } from '$lib/api/common';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import InfoIconLink from '$lib/components/link/InfoIconLink.svelte';
	import CreateEntityButton from '$lib/components/non-generic/button/CreateEntityButton.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import { toDateTime } from '$lib/utils/date';
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
	const filters = writable<GetAccessLevelsFilters>({});

	const query = createQuery(
		derived([pagination, filters], ([$pagination, $filters]) => ({
			queryKey: ['access-levels', $pagination, $filters],
			placeholderData: keepPreviousData,
			queryFn: async (): Promise<Paginated<AccessLevel>> => {
				const result = await apiGetAccessLevels({ pagination: $pagination, filters: $filters });

				$options.data = result.records;

				return result;
			}
		}))
	);

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
				renderComponent(InfoIconLink, { href: `/client/access-levels/${row.original.id}` })
		}
	];

	const colspan = columns.length;

	const options = writable<TableOptions<AccessLevel>>({
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

<div class="p-6 max-w-5xl mx-auto">
	<TitleAndBreadCrumbsPageHeader
		title="access levels"
		breadCrumbs={[
			{ href: '/client', icon: 'mdi:home', text: 'home' },
			{ href: '/client/access-levels', icon: 'mdi:shield', text: 'access levels' }
		]}
	/>

	<hr class="my-4" />

	<div class="flex mb-4 items-center">
		<DebouncedTextField
			placeholder="search by name"
			title="filter by name"
			class="label w-full max-w-lg mr-4"
			on:change={(e) => ($filters.name = e.detail)}
		/>

		<CreateEntityButton
			href="/client/access-levels/new"
			text="new access level"
			requiredPermission="MANAGE_USER_ACCESS_LEVELS"
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
