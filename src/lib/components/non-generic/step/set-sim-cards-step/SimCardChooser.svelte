<script lang="ts">
	import type { createSimCardSchema, SimCard, updateSimCardSchema } from '$lib/api/sim-card.schema';
	import type { Tracker } from '$lib/api/tracker.schema';
	import OptionToggler from '$lib/components/toggler/OptionToggler.svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import CreateSimCardForm from '../../form/CreateSimCardForm.svelte';
	import SelectSimCardDataTable from '../../table/SelectSimCardDataTable.svelte';

	interface Props {
		/**
		 * Tracker to be associated with the sim card to be created or selected
		 */
		tracker: Tracker;

		/**
		 * Slot the tracker is being inserted into
		 */
		simSlot: number;

		updateSimCardFormSchema: SuperValidated<Infer<typeof updateSimCardSchema>>;

		createSimCardFormSchema: SuperValidated<Infer<typeof createSimCardSchema>>;

		onSimCardCreated: (_: SimCard) => void;

		onSimCardSelected: (_: SimCard) => void;
	}

	let {
		tracker,
		simSlot,
		createSimCardFormSchema,
		updateSimCardFormSchema,
		onSimCardCreated,
		onSimCardSelected
	}: Props = $props();

	type action = 'new-sim-card' | 'existing-sim-card';

	let selectedOption: action = $state('new-sim-card');
</script>

<OptionToggler
	additionalClasses="mb-4"
	bind:selectedOption
	options={[
		{
			value: 'new-sim-card',
			label: 'create a new SIM',
			classes: 'btn w-full preset-filled-primary-100-900'
		},
		{
			value: 'existing-sim-card',
			label: 'use a existing SIM',
			classes: 'btn w-full preset-filled-secondary-100-900'
		}
	]}
/>

{#if selectedOption === 'existing-sim-card'}
	<SelectSimCardDataTable
		formSchema={updateSimCardFormSchema}
		trackerIdToAssociate={tracker.id}
		onSelected={onSimCardSelected}
	/>
{:else}
	<CreateSimCardForm
		slotNumber={simSlot}
		formSchema={createSimCardFormSchema}
		trackerIdToAssociate={tracker.id}
		onCreate={onSimCardCreated}
	/>
{/if}
