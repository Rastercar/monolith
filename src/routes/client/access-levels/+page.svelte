<script lang="ts">
	import { apiGetAccessLevelsQuery } from '$lib/api/access-level.queries';
	import type { AccessLevel, GetAccessLevelFilters } from '$lib/api/access-level.schema';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import InfoIconLink from '$lib/components/link/InfoIconLink.svelte';
	import CreateEntityButton from '$lib/components/non-generic/button/CreateEntityButton.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import DataTableFooter from '$lib/components/table/DataTableFooter.svelte';
	import { route } from '$lib/ROUTES';
	import { createPaginationWithFilters } from '$lib/store/data-table.svelte';
	import { toDateTime } from '$lib/utils/date';
	import {
		createSvelteTable,
		getCoreRowModel,
		renderComponent,
		type ColumnDef
	} from '@tanstack/svelte-table';

	const { pagination, filters } = createPaginationWithFilters<GetAccessLevelFilters>({});

	const query = apiGetAccessLevelsQuery(pagination, filters);

	const columns: ColumnDef<AccessLevel>[] = [
		{
			accessorKey: 'name',
			header: () => 'Nome'
		},
		{
			accessorKey: 'description',
			header: () => 'Descrição'
		},
		{
			accessorKey: 'createdAt',
			header: () => 'Data de cadastro',
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
		title="níveis de acesso"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ href: route('/client/access-levels'), icon: 'mdi:shield', text: 'níveis de acesso' }
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
			href={route('/client/access-levels/new')}
			text="novo nível de acesso"
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
</PageContainer>
