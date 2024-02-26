<script lang="ts">
	import type { createSimCardSchema } from '$lib/api/sim-card.schema';
	import type { Tracker } from '$lib/api/tracker.schema';
	import CreateSimCardForm from '$lib/components/non-generic/form/CreateSimCardForm.svelte';
	import SelectSimCardDataTable from '$lib/components/non-generic/table/SelectSimCardDataTable.svelte';
	import OptionToggler from '$lib/components/toggler/OptionToggler.svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	/**
	 * Tracker to be associated with the sim card to be created or selected
	 */
	export let tracker: Tracker;

	export let slot: number;

	export let formSchema: SuperValidated<Infer<typeof createSimCardSchema>>;

	type action = 'new-sim-card' | 'existing-sim-card';

	let selectedOption: action = 'new-sim-card';
</script>

<OptionToggler
	additionalClasses="mb-4"
	bind:selectedOption
	options={[
		{
			value: 'new-sim-card',
			label: 'create a new SIM',
			classes: 'btn btn-sm w-full variant-filled-primary'
		},
		{
			value: 'existing-sim-card',
			label: 'use a existing SIM',
			classes: 'btn btn-sm w-full variant-filled-secondary'
		}
	]}
/>

{#if selectedOption === 'existing-sim-card'}
	<SelectSimCardDataTable trackerIdToAssociate={tracker.id} on:sim-card-selected />
{:else}
	<CreateSimCardForm {slot} trackerIdToAssociate={tracker.id} {formSchema} on:sim-card-created />
{/if}
