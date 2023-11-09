<script lang="ts">
	import type { createTrackerSchema } from '$lib/api/tracker.schema';
	import OptionToggler from '$lib/components/toggler/OptionToggler.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import TrackerForm from './TrackerForm.svelte';

	let selectedTrackerForm: 'new-tracker' | 'existing-tracker' = 'new-tracker';

	// TODO: get vehicle id

	export let formSchema: SuperValidated<typeof createTrackerSchema>;
</script>

<span class="text-sm">How will you track your vehicle ?</span>

<OptionToggler
	bind:selectedOption={selectedTrackerForm}
	additionalClasses="my-4"
	options={[
		{
			value: 'new-tracker',
			label: 'create a new tracker',
			classes: 'btn btn-sm w-full variant-filled-primary'
		},
		{
			value: 'existing-tracker',
			label: 'use a existing tracker',
			classes: 'btn btn-sm w-full variant-filled-secondary'
		}
	]}
/>

{#if selectedTrackerForm === 'existing-tracker'}
	<div>select tracker input</div>
{:else}
	<TrackerForm {formSchema} />
{/if}
