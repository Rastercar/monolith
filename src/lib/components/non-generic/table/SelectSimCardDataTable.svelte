<script lang="ts">
	import { apiGetSimCards } from '$lib/api/sim-card';
	import {
		updateSimCardSchema,
		type GetSimCardsFilters,
		type SimCard
	} from '$lib/api/sim-card.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import DebouncedTextField from '$lib/components/input/DebouncedTextField.svelte';
	import SimpleCheckbox from '$lib/components/input/SimpleCheckbox.svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import DataTableFooter from '$lib/components/table/DataTableFooter.svelte';
	import { route } from '$lib/ROUTES';
	import { createPaginationWithFilters } from '$lib/store/data-table.svelte';
	import { showErrorToast } from '$lib/store/toast';
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import {
		createSvelteTable,
		getCoreRowModel,
		renderComponent,
		type ColumnDef,
		type RowSelectionState
	} from '@tanstack/svelte-table';
	import { Popover } from 'bits-ui';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface Props {
		/**
		 * The ID of the tracker to associate the selected SIM card to
		 */
		trackerIdToAssociate: number;

		/**
		 * Form to update a sim card
		 */
		formSchema: SuperValidated<Infer<typeof updateSimCardSchema>>;

		onSelected: (_: SimCard) => void;
	}

	let { trackerIdToAssociate, formSchema, onSelected }: Props = $props();

	const sForm = superForm(formSchema, {
		id: `selected-sim-card-form`,
		validators: zodClient(updateSimCardSchema),
		onUpdate: ({ form }) => {
			if (form.valid && selectedSimCard) onSelected(selectedSimCard);
		},
		onError: showErrorToast
	});
	const { submitting: isLoading } = sForm;

	let rowSelection = $state<RowSelectionState>({});

	const { pagination, filters } = createPaginationWithFilters<GetSimCardsFilters>(
		{ withAssociatedTracker: false },
		{ page: 1, pageSize: 3 }
	);

	const query = createQuery(() => ({
		queryKey: ['sim-cards', pagination, filters],
		queryFn: async () => {
			const result = await apiGetSimCards({ pagination: pagination, filters: filters });

			// reset row selection since the dataset changed
			rowSelection = {};

			return result;
		},
		placeholderData: keepPreviousData
	}));

	const columns: ColumnDef<SimCard>[] = [
		{ accessorKey: 'phoneNumber', header: () => 'Phone' },
		{ accessorKey: 'ssn', header: () => 'SSN' },
		{ accessorKey: 'apnAddress', header: () => 'APN' },
		{
			accessorKey: 'createdAt',
			header: () => 'Created at',
			cell: ({ cell }) => new Date(cell.row.original.createdAt).toLocaleDateString()
		},
		{
			id: 'selector',
			cell: (cell) =>
				renderComponent(SimpleCheckbox, {
					checked: cell.row.getIsSelected(),
					disabled: !cell.row.getCanSelect(),
					indeterminate: cell.row.getIsSomeSelected(),
					onChange: (a) => (rowSelection = { [cell.row.id]: a })
				})
		}
	];

	const table = $derived(
		createSvelteTable({
			data: query.data?.records ?? [],
			columns: columns,
			manualPagination: true,
			enableRowSelection: true,
			enableMultiRowSelection: false,
			state: {
				rowSelection,
				pagination: {
					pageIndex: pagination.page,
					pageSize: pagination.pageSize
				}
			},
			getCoreRowModel: getCoreRowModel()
		})
	);

	let selectedSimCard = $derived.by(() => {
		const selectedRow = Object.entries(rowSelection).find(([_, isSelected]) => isSelected);

		if (!selectedRow) return null;

		const rowId = selectedRow[0];
		return $table.getRow(rowId).original;
	});
</script>

<DebouncedTextField
	classes="label my-4"
	placeholder="Filter by phone number"
	onChange={(v) => (filters.phoneNumber = v)}
/>

<DataTable {table} isLoading={query.isFetching} />

<DataTableFooter
	extraClasses="mt-4"
	bind:page={pagination.page}
	bind:pageSize={pagination.pageSize}
	data={query.data?.records ?? []}
	count={query.data?.itemCount ?? 0}
/>

<Popover.Root>
	<Popover.Trigger class="flex items-center mt-2 justify-end w-full">
		<button type="button" class="btn p-0 text-primary-800-200 ml-auto">
			not finding your sim card ?
		</button>
	</Popover.Trigger>

	<Popover.Portal>
		<Popover.Content
			class="z-30 max-w-96 rounded-lg bg-surface-200-800 p-4 shadow-lg"
			align="end"
			sideOffset={8}
		>
			<p>
				Only SIM cards that are not associated with a tracker can be selected, if you wish to use a
				SIM card that is already installed on a tracker, please uninstall the SIM card.
			</p>
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>

{#if selectedSimCard}
	<form
		class="flex justify-end mt-4"
		method="POST"
		action={route('updateSimCard /client/tracking/sim-cards/[sim_card_id=integer]', {
			sim_card_id: selectedSimCard.id.toString()
		})}
		use:sForm.enhance
	>
		<input type="hidden" name="vehicleTrackerId" value={trackerIdToAssociate} />

		<LoadableButton isLoading={$isLoading} classes="btn preset-filled-primary-500 ml-auto mt-auto">
			select SIM card
		</LoadableButton>
	</form>
{/if}
