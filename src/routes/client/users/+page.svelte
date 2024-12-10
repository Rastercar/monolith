<script lang="ts">
	import { apiGetUsers } from '$lib/api/user';
	import type { GetUsersFilters, SimpleUser } from '$lib/api/user.schema';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import InfoIconLink from '$lib/components/link/InfoIconLink.svelte';
	import CreateEntityButton from '$lib/components/non-generic/button/CreateEntityButton.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import DataTableFooter from '$lib/components/table/DataTableFooter.svelte';
	import { route } from '$lib/ROUTES';
	import { toLocaleDateString } from '$lib/utils/date';
	import { createQuery } from '@tanstack/svelte-query';
	import {
		createSvelteTable,
		getCoreRowModel,
		renderComponent,
		type ColumnDef
	} from '@tanstack/svelte-table';
	import UserEmailColumn from './components/UserEmailColumn.svelte';

	const pagination = $state({ page: 1, pageSize: 5 });

	const filters = $state<GetUsersFilters>({});

	const query = createQuery(() => ({
		queryKey: ['users', pagination, filters],
		queryFn: () => apiGetUsers({ pagination: pagination, filters: filters })
	}));

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
				return renderComponent(UserEmailColumn, { email, verified: emailVerified });
			}
		},
		{
			accessorKey: 'createdAt',
			header: () => 'Created At',
			cell: ({ row }) => toLocaleDateString(row.original.createdAt)
		},
		{
			id: 'actions',
			cell: ({ row }) =>
				renderComponent(InfoIconLink, {
					href: route(`/client/users/[user_id=integer]`, {
						user_id: row.original.id.toString()
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
		data={query.data?.records ?? []}
		count={query.data?.itemCount ?? 0}
	/>
</div>
