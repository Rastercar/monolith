<script lang="ts">
	import type { Tracker } from '$lib/api/tracker.schema';
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import SetSimCardsStep from '$lib/components/non-generic/step/set-sim-cards-step/SetSimCardsStep.svelte';
	import Step from '$lib/components/stepper/Step.svelte';
	import Stepper from '$lib/components/stepper/Stepper.svelte';
	import StepperHeader from '$lib/components/stepper/StepperHeader.svelte';
	import CreateVehicleForm from './components/create-vehicle-step/CreateVehicleForm.svelte';
	import SetTrackerStep from './components/set-tracker-step/SetTrackerStep.svelte';

	let { data } = $props();

	let createdVehicle: Vehicle | null = $state(null);
	let createdOrSelectedTracker: Tracker | null = $state(null);

	const setVehicle = (e: CustomEvent<Vehicle>) => (createdVehicle = e.detail);
	const setTracker = (e: CustomEvent<Tracker>) => (createdOrSelectedTracker = e.detail);
</script>

<Stepper>
	<StepperHeader extraClasses="mb-4" />

	<Step>
		{#snippet header()}
			Vehicle Information
		{/snippet}
		<CreateVehicleForm formSchema={data.createVehicleForm} on:vehicle-created={setVehicle} />
	</Step>

	<Step>
		{#snippet header()}
			Inform your vehicle tracker
		{/snippet}
		{#if createdVehicle}
			<span class="text-sm mb-4 block">How will you track your vehicle ?</span>

			<SetTrackerStep
				vehicleId={createdVehicle.id}
				formSchema={data.createTrackerForm}
				on:tracker-created={setTracker}
				on:tracker-selected={setTracker}
			/>
		{/if}
	</Step>

	<Step>
		{#snippet header()}
			Set the SIM card
		{/snippet}
		{#if createdOrSelectedTracker}
			<SetSimCardsStep tracker={createdOrSelectedTracker} formSchema={data.createSimCardForm} />
		{/if}
	</Step>

	<Step>
		{#snippet header()}
			Review
		{/snippet}
		<!--
			TODO: 
			wherener we got the following pages 
		 	show a guide on how to configure the tracker 
		 	show a skippable option to test the tracker connection 
		 	show a option to see the vehicle on the map 
		-->
		<p>!!!</p>
	</Step>
</Stepper>
