<script lang="ts">
	import type { createTrackerSchema } from '$lib/api/tracker.schema';
	import OptionToggler from '$lib/components/toggler/OptionToggler.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import SelectTrackerDataTable from './SelectTrackerDataTable.svelte';
	import TrackerForm from './TrackerForm.svelte';

	let selectedTrackerForm: 'new-tracker' | 'existing-tracker' = 'new-tracker';

	/**
	 * ID of the vehicle to be associated with the tracker to be created or selected
	 */
	export let vehicleId: number;

	export let formSchema: SuperValidated<typeof createTrackerSchema>;
</script>

<span class="text-sm">How will you track your vehicle ?</span>

<OptionToggler
	bind:selectedOption={selectedTrackerForm}
	additionalClasses="my-4"
	options={[
		{
			value: 'new-tracker',
			label: 'create tracker',
			classes: 'btn btn-sm w-full variant-filled-primary'
		},
		{
			value: 'existing-tracker',
			label: 'use existing tracker',
			classes: 'btn btn-sm w-full variant-filled-secondary'
		}
	]}
/>

{#if selectedTrackerForm === 'existing-tracker'}
	<!-- TODO: finish me !   -->
	<SelectTrackerDataTable />
{:else}
	<TrackerForm {formSchema} vehicleIdToAssociate={vehicleId} on:tracker-created />
{/if}
