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

	// TODO: change to null
	let createdVehicle: Vehicle | null = { id: 15 } as any;
	// TODO: change to null
	let createdOrSelectedTracker: Tracker | null = { id: 2 } as any;

	const setVehicle = (e: CustomEvent<Vehicle>) => (createdVehicle = e.detail);
	const setTracker = (e: CustomEvent<Tracker>) => (createdOrSelectedTracker = e.detail);
</script>

<!--
	TODO:
	this page can only be show if the user can:
	create vehicle
	create tracker
	create sim card
	(use permission guard component)

	TODO:
	make it possible to go back steps and see what has been done (created vehicle, etc)
-->
<div class="p-6 max-w-3xl mx-auto">
	<!-- TODO: change to 0 -->
	<Stepper start={2}>
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
	</Stepper>
</div>
