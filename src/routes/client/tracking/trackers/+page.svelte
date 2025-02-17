<script lang="ts">
	import { apiGetTrackersQuery } from '$lib/api/tracker.queries';
	import type { GetTrackersFilters, Tracker } from '$lib/api/tracker.schema';
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

	const { pagination, filters } = createPaginationWithFilters<GetTrackersFilters>({});

	const query = apiGetTrackersQuery(pagination, filters);

	const columns: ColumnDef<Tracker>[] = [
		{
			accessorKey: 'model',
			header: () => 'Model'
		},
		{
			accessorKey: 'imei',
			header: () => 'IMEI'
		},
		{
			id: 'actions',
			cell: ({ row }) =>
				renderComponent(InfoIconLink, {
					href: route('/client/tracking/trackers/[tracker_id=integer]', {
						tracker_id: row.original.id.toString()
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
		title="trackers"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ text: 'tracking' },
			{ href: route('/client/tracking/trackers'), icon: 'mdi:cellphone', text: 'trackers' }
		]}
	/>

	<hr class="hr mt-4 mb-8" />

	<div class="flex mb-4 items-center space-x-4">
		<DebouncedTextField
			placeholder="search by imei"
			classes="w-full"
			onChange={(v) => (filters.imei = v)}
		/>

		<CreateEntityButton
			href={route('/client/tracking/trackers/new')}
			text="new tracker"
			requiredPermissions="CREATE_TRACKER"
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
