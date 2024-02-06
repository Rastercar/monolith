<script lang="ts">
	import type { Tracker } from '$lib/api/tracker.schema';
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import Step from '$lib/components/stepper/Step.svelte';
	import Stepper from '$lib/components/stepper/Stepper.svelte';
	import StepperHeader from '$lib/components/stepper/StepperHeader.svelte';
	import type { PageData } from './$types';
	import CreateVehicleForm from './components/create-vehicle-step/CreateVehicleForm.svelte';
	import SetSimCardStep from './components/set-sim-card-step/SetSimCardStep.svelte';
	import SetTrackerStep from './components/set-tracker-step/SetTrackerStep.svelte';

	export let data: PageData;

	let createdVehicle: Vehicle | null = null;
	let createdOrSelectedTracker: Tracker | null = null;

	const setVehicle = (e: CustomEvent<Vehicle>) => (createdVehicle = e.detail);
	const setTracker = (e: CustomEvent<Tracker>) => (createdOrSelectedTracker = e.detail);
</script>

<Stepper start={0}>
	<StepperHeader additionalClasses="mb-4" />

	<Step>
		<svelte:fragment slot="header">Vehicle Information</svelte:fragment>
		<CreateVehicleForm formSchema={data.createVehicleForm} on:vehicle-created={setVehicle} />
	</Step>

	<Step>
		<svelte:fragment slot="header">Inform your vehicle tracker</svelte:fragment>
		{#if createdVehicle}
			<SetTrackerStep
				vehicleId={createdVehicle.id}
				formSchema={data.createTrackerForm}
				on:tracker-created={setTracker}
				on:tracker-selected={setTracker}
			/>
		{/if}
	</Step>

	<Step>
		<svelte:fragment slot="header">Set the SIM card</svelte:fragment>
		{#if createdOrSelectedTracker}
			<SetSimCardStep tracker={createdOrSelectedTracker} formSchema={data.createSimCardForm} />
		{/if}
	</Step>

	<Step>
		<svelte:fragment slot="header">Review</svelte:fragment>
		<!-- TODO: -->
		<!-- show a guide on how to configure the tracker -->
		<!-- show a skippable option to test the tracker connection -->
		<!-- show a option to see the vehicle on the map -->
		<p>!!!</p>
	</Step>
</Stepper>
