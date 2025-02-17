<script lang="ts">
	import { apiGetUsersQuery } from '$lib/api/user.queries';
	import type { GetUsersFilters, SimpleUser } from '$lib/api/user.schema';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import InfoIconButton from '$lib/components/link/InfoIconButton.svelte';
	import CreateEntityButton from '$lib/components/non-generic/button/CreateEntityButton.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import DataTableActioMenu from '$lib/components/table/DataTableActioMenu.svelte';
	import DataTableFooter from '$lib/components/table/DataTableFooter.svelte';
	import { route } from '$lib/ROUTES';
	import { getAuthContext } from '$lib/store/context';
	import { createPaginationWithFilters } from '$lib/store/data-table.svelte';
	import { toLocaleDateString } from '$lib/utils/date';
	import {
		createSvelteTable,
		getCoreRowModel,
		renderComponent,
		type ColumnDef
	} from '@tanstack/svelte-table';
	import BlockStatusColumn from './components/BlockStatusColumn.svelte';
	import BlockUserButton from './components/BlockUserButton.svelte';
	import UserEmailColumn from './components/UserEmailColumn.svelte';

	const { pagination, filters } = createPaginationWithFilters<GetUsersFilters>({});

	const auth = getAuthContext();

	const canBlockUsers = auth.hasPermission('BLOCK_USER');

	const query = apiGetUsersQuery(pagination, filters);

	const columns: ColumnDef<SimpleUser>[] = [
		{
			accessorKey: 'username',
			header: () => 'Username'
		},
		{
			accessorKey: 'email',
			header: () => 'Email',
			cell: ({ row }) => {
				const { email, emailVerified } = row.original;
				return renderComponent(UserEmailColumn, { email, verified: emailVerified });
			}
		},
		{
			accessorKey: 'createdAt',
			header: () => 'Created At',
			cell: ({ row }) => toLocaleDateString(row.original.createdAt)
		},
		{
			accessorKey: 'blocked',
			header: () => 'App Access',
			cell: ({ row }) => renderComponent(BlockStatusColumn, { isBlocked: row.original.blocked })
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const items = [
					renderComponent(InfoIconButton, {
						href: route(`/client/users/[user_id=integer]`, {
							user_id: row.original.id.toString()
						})
					})
				];

				if (canBlockUsers) {
					const blockBtn = renderComponent(BlockUserButton, {
						userId: row.original.id,
						isBlocked: row.original.blocked,
						onBlockedStatusChange: query.refetch
					});

					items.unshift(blockBtn);
				}

				return renderComponent(DataTableActioMenu, { items });
			}
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
		title="users"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ href: route('/client/users'), icon: 'mdi:account-multiple', text: 'users' }
		]}
	/>

	<hr class="hr mt-4 mb-8" />

	<div class="flex mb-4 items-center space-x-4">
		<DebouncedTextField
			placeholder="search by email"
			classes="w-full"
			onChange={(v) => (filters.email = v)}
		/>

		<CreateEntityButton
			href={route('/client/users/new')}
			text="new user"
			requiredPermissions="CREATE_USER"
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
