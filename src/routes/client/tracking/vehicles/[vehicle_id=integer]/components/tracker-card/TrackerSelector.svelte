<!-- @migration-task Error while migrating Svelte code: 'default' is a reserved word in JavaScript and cannot be used here -->
<script lang="ts">
	import { apiSetTrackerVehicle } from '$lib/api/tracker';
	import type { Tracker, createTrackerSchema } from '$lib/api/tracker.schema';
	import CreateTrackerForm from '$lib/components/non-generic/form/CreateTrackerForm.svelte';
	import OptionToggler from '$lib/components/toggler/OptionToggler.svelte';
	import { showErrorToast } from '$lib/store/toast';
	import { createMutation } from '@tanstack/svelte-query';
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

	const selectTrackerMutation = createMutation(() => ({
		mutationFn: (vehicleTrackerId: number) => apiSetTrackerVehicle({ vehicleId, vehicleTrackerId }),
		onError: showErrorToast
	}));

	const associateTrackerToVehicle = (tracker: Tracker | null) => {
		if (!tracker) return;

		selectTrackerMutation.mutateAsync(tracker.id).then(() => {
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

<!-- TODO: -->
{#if selectedTrackerForm === 'existing-tracker'}
	<!-- <SelectTrackerDataTable>
		<div slot="bottom-right" let:isLoading let:selectedTracker>
			<LoadableButton
				isLoading={selectTrackerMutation.isPending}
				classes="btn variant-filled-primary mt-4"
				disabled={!selectedTracker || isLoading}
				onclick={() => associateTrackerToVehicle(selectedTracker)}
			>
				use selected tracker
			</LoadableButton>
		</div>
	</SelectTrackerDataTable> -->
{:else}
	<CreateTrackerForm {formSchema} vehicleIdToAssociate={vehicleId} onCreated={onTrackerCreated} />
{/if}
