<script lang="ts">
	import type { Tracker } from '$lib/api/tracker.schema';
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import Step from '$lib/components/stepper/Step.svelte';
	import Stepper from '$lib/components/stepper/Stepper.svelte';
	import StepperHeader from '$lib/components/stepper/StepperHeader.svelte';
	import OptionToggler from '$lib/components/toggler/OptionToggler.svelte';
	import type { PageData } from './$types';
	import SelectOrCreateTrackerStep from './components/SelectOrCreateTrackerStep.svelte';
	import VehicleForm from './components/VehicleForm.svelte';

	export let data: PageData;

	// TODO: change to null
	let createdVehicle: Vehicle | null = { id: 2 } as any;
	let createdOrSelectedTracker: Tracker | null = null;

	let selectedSimCardForm: 'new-sim-card' | 'existing-sim-card' = 'new-sim-card';
</script>

<!--
	TODO:
	this page can only be show if the user can:
	create vehicle
	create tracker
	create sim card

	TODO:
	make it possible to go back steps and see what has been done (created vehicle, etc)
-->
<div class="p-6 max-w-3xl mx-auto">
	<!-- TODO: change to 0 -->
	<Stepper start={2}>
		<StepperHeader additionalClasses="mb-4" />

		<Step>
			<svelte:fragment slot="header">Vehicle Information</svelte:fragment>
			<VehicleForm
				formSchema={data.createVehicleForm}
				on:vehicle-created={({ detail: vehicle }) => {
					createdVehicle = vehicle;
				}}
			/>
		</Step>

		<Step>
			<svelte:fragment slot="header">Inform your vehicle tracker</svelte:fragment>
			{#if createdVehicle?.id}
				<SelectOrCreateTrackerStep
					vehicleId={createdVehicle?.id}
					formSchema={data.createTrackerForm}
					on:tracker-created={({ detail: tracker }) => {
						createdOrSelectedTracker = tracker;
					}}
				/>
			{/if}
		</Step>

		<Step>
			<svelte:fragment slot="header">Set the tracker sim card</svelte:fragment>

			<span class="text-sm">Choose a sim card for the vehicle tracker</span>

			<OptionToggler
				bind:selectedOption={selectedSimCardForm}
				additionalClasses="my-4"
				options={[
					{
						value: 'new-sim-card',
						label: 'create a new sim card',
						classes: 'btn btn-sm w-full variant-filled-primary'
					},
					{
						value: 'existing-sim-card',
						label: 'use a existing sim card',
						classes: 'btn btn-sm w-full variant-filled-secondary'
					}
				]}
			/>

			{#if selectedSimCardForm === 'existing-sim-card'}
				<div class="my-4">select sim card input with probable existing sim card value</div>
			{:else}
				<!-- TODO: if tracker has sim card show warning that the current sim card will be released from the tracker -->
				<div class="my-4">create sim card form</div>
			{/if}

			<p>
				show form to create, change or use a sim card, the only edgecase is to show the existing sim
				card if using a existing tracker
			</p>
		</Step>
	</Stepper>
</div>
