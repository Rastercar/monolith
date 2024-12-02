<script lang="ts">
	import type { Paginated } from '$lib/api/common';
	import { apiGetUsers, type GetUserFilters } from '$lib/api/user';
	import type { SimpleUser } from '$lib/api/user.schema';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import InfoIconLink from '$lib/components/link/InfoIconLink.svelte';
	import CreateEntityButton from '$lib/components/non-generic/button/CreateEntityButton.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import { toLocaleDateString } from '$lib/utils/date';
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
	import UserEmailColumn from './components/UserEmailColumn.svelte';

	const pagination = writable({ page: 1, pageSize: 5 });
	const filters = writable<GetUserFilters>({});

	const query = createQuery(
		derived([pagination, filters], ([$pagination, $filters]) => ({
			queryKey: ['users', $pagination, $filters],
			placeholderData: keepPreviousData,
			queryFn: async (): Promise<Paginated<SimpleUser>> => {
				const result = await apiGetUsers({ pagination: $pagination, filters: $filters });

				$options.data = result.records;

				return result;
			}
		}))
	);

	const columns: ColumnDef<SimpleUser>[] = [
		{
			accessorKey: 'username',
			header: () => 'Username'
		},
		{
			accessorKey: 'email',
			header: () => 'Email',
			cell: ({ row }) => {
				const { email, emailVerified, id } = row.original;
				return renderComponent(UserEmailColumn, { email, verified: emailVerified, idx: id });
			}
		},
		{
			accessorKey: 'createdAt',
			header: () => 'Created At',
			cell: ({ row }) => toLocaleDateString(row.original.createdAt)
		},
		{
			id: 'actions',
			cell: ({ row }) => renderComponent(InfoIconLink, { href: `/client/users/${row.original.id}` })
		}
	];

	const colspan = columns.length;

	const options = writable<TableOptions<SimpleUser>>({
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
		title="users"
		breadCrumbs={[
			{ href: '/client', icon: 'mdi:home', text: 'home' },
			{ href: '/client/users', icon: 'mdi:account-multiple', text: 'users' }
		]}
	/>

	<hr class="my-4" />

	<div class="flex mb-4 items-center">
		<DebouncedTextField
			placeholder="search by email"
			title="filter by email"
			class="label w-full max-w-lg mr-4"
			on:change={(e) => ($filters.email = e.detail)}
		/>

		<CreateEntityButton href="/client/users/new" text="new user" requiredPermission="CREATE_USER" />
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
