<script lang="ts">
	import { apiSetTrackerVehicle } from '$lib/api/tracker';
	import type { Tracker, createTrackerSchema } from '$lib/api/tracker.schema';
	import CreateTrackerForm from '$lib/components/non-generic/form/CreateTrackerForm.svelte';
	import SelectTrackerDataTable from '$lib/components/non-generic/table/SelectTrackerDataTable.svelte';
	import StepperNextStepBtn from '$lib/components/stepper/StepperNextStepBtn.svelte';
	import type { StepperState } from '$lib/components/stepper/types';
	import OptionToggler from '$lib/components/toggler/OptionToggler.svelte';
	import { getToaster } from '$lib/store/toaster';
	import { createMutation } from '@tanstack/svelte-query';
	import { createEventDispatcher, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { SuperValidated } from 'sveltekit-superforms';

	let selectedTrackerForm: 'new-tracker' | 'existing-tracker' = 'new-tracker';

	/**
	 * ID of the vehicle to be associated with the tracker to be created or selected
	 */
	export let vehicleId: number;

	export let formSchema: SuperValidated<typeof createTrackerSchema>;

	const toaster = getToaster();

	const mutation = createMutation({
		mutationFn: (trackerId: number) => apiSetTrackerVehicle({ vehicleId, trackerId }),
		onError: toaster.error
	});

	let stepperState: Writable<StepperState> = getContext('state');

	const associateTrackerToVehicle = (tracker: Tracker | null) => {
		if (!tracker) return;

		$mutation.mutateAsync(tracker.id).then(() => {
			$stepperState.current++;
			dispatch('tracker-selected', tracker);
		});
	};

	const dispatch = createEventDispatcher<{
		'tracker-selected': Tracker;
		'tracker-created': Tracker;
	}>();

	const onTrackerCreated = (e: CustomEvent<Tracker>) => {
		dispatch('tracker-created', e.detail);
		$stepperState.current++;
	};
</script>

<OptionToggler
	bind:selectedOption={selectedTrackerForm}
	additionalClasses="mb-4"
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
	<SelectTrackerDataTable>
		<div slot="bottom-right" let:isLoading let:selectedTracker>
			<StepperNextStepBtn
				{isLoading}
				class="mt-4"
				canSubmit={!!selectedTracker}
				on:click={() => associateTrackerToVehicle(selectedTracker)}
			/>
		</div>
	</SelectTrackerDataTable>
{:else}
	<CreateTrackerForm
		{formSchema}
		vehicleIdToAssociate={vehicleId}
		on:tracker-created={onTrackerCreated}
	>
		<div slot="default" class="flex justify-end" let:isLoading let:canSubmit let:createTracker>
			<StepperNextStepBtn {canSubmit} {isLoading} on:click={createTracker} />
		</div>
	</CreateTrackerForm>
{/if}
