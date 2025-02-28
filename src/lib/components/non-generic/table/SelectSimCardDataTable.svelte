<script lang="ts">
	import { apiGetSimCardsQuery } from '$lib/api/sim-card.queries';
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

	const query = apiGetSimCardsQuery(pagination, filters, { refetchOnWindowFocus: false });

	$effect(() => {
		if (query.isFetching) rowSelection = {};
	});

	const columns: ColumnDef<SimCard>[] = [
		{ accessorKey: 'phoneNumber', header: () => 'Telefone' },
		{ accessorKey: 'ssn', header: () => 'SSN' },
		{ accessorKey: 'apnAddress', header: () => 'APN' },
		{
			accessorKey: 'createdAt',
			header: () => 'Data de cadastro',
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
			columns,
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
	placeholder="Filtrar por telefone"
	onChange={(v) => (filters.phoneNumber = v)}
/>

<DataTable {table} isLoading={query.isFetching} />

<DataTableFooter
	extraClasses="mt-4"
	bind:page={pagination.page}
	bind:pageSize={pagination.pageSize}
	data={query.data?.records}
	count={query.data?.itemCount}
/>

<Popover.Root>
	<Popover.Trigger class="flex items-center mt-2 justify-end w-full">
		<button type="button" class="btn p-0 text-primary-800-200 ml-auto">
			Não está encontrando seu cartão SIM?
		</button>
	</Popover.Trigger>

	<Popover.Portal>
		<Popover.Content
			class="z-30 max-w-96 rounded-lg bg-surface-200-800 p-4 shadow-lg"
			align="end"
			sideOffset={8}
		>
			<p>
				Apenas cartões SIM que não estão associados com um rastreador podem ser selecionados, se
				deseja usar um cartão que já esta associado a um rastreador, remova ele do rastreador.
			</p>
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>

{#if selectedSimCard}
	<form
		class="flex justify-end mt-4"
		method="POST"
		action={route('updateSimCard /client/rastreamento/cartoes-sim/[sim_card_id=integer]', {
			sim_card_id: selectedSimCard.id.toString()
		})}
		use:sForm.enhance
	>
		<input type="hidden" name="vehicleTrackerId" value={trackerIdToAssociate} />

		<LoadableButton isLoading={$isLoading} classes="btn preset-filled-primary-500 ml-auto mt-auto">
			selecionar cartão SIM
		</LoadableButton>
	</form>
{/if}
