<script lang="ts">
	import { apiSetTrackerVehicleMutation } from '$lib/api/tracker.queries';
	import type { Tracker, createTrackerSchema } from '$lib/api/tracker.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import CreateTrackerForm from '$lib/components/non-generic/form/CreateTrackerForm.svelte';
	import SelectTrackerDataTable from '$lib/components/non-generic/table/SelectTrackerDataTable.svelte';
	import OptionToggler from '$lib/components/toggler/OptionToggler.svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	let selectedTrackerForm: 'new-tracker' | 'existing-tracker' = $state('new-tracker');

	interface Props {
		/**
		 * ID of the vehicle to be associated with the tracker to be created or selected
		 */
		vehicleId: number;
		formSchema: SuperValidated<Infer<typeof createTrackerSchema>>;

		onTrackerCreated: (_: Tracker) => void;
		onTrackerSelected: (_: Tracker) => void;
	}

	let { vehicleId, formSchema, onTrackerCreated, onTrackerSelected }: Props = $props();

	const selectTrackerMutation = apiSetTrackerVehicleMutation();

	const associateTrackerToVehicle = (tracker: Tracker | null) => {
		if (!tracker) return;

		selectTrackerMutation.mutateAsync({ vehicleId, vehicleTrackerId: tracker.id }).then(() => {
			onTrackerSelected(tracker);
		});
	};
</script>

<OptionToggler
	bind:selectedOption={selectedTrackerForm}
	additionalClasses="mb-4"
	options={[
		{
			value: 'new-tracker',
			label: 'create tracker',
			classes: 'btn w-full preset-filled-primary-200-800'
		},
		{
			value: 'existing-tracker',
			label: 'use existing tracker',
			classes: 'btn w-full preset-filled-secondary-200-800'
		}
	]}
/>

{#if selectedTrackerForm === 'existing-tracker'}
	<SelectTrackerDataTable>
		{#snippet bottomRight({ selectedTracker, isLoading })}
			<LoadableButton
				isLoading={selectTrackerMutation.isPending}
				classes="btn preset-filled-primary-200-800 mt-4"
				disabled={!selectedTracker || isLoading}
				onclick={() => associateTrackerToVehicle(selectedTracker)}
			>
				use selected tracker
			</LoadableButton>
		{/snippet}
	</SelectTrackerDataTable>
{:else}
	<CreateTrackerForm {formSchema} vehicleIdToAssociate={vehicleId} onCreated={onTrackerCreated} />
{/if}
