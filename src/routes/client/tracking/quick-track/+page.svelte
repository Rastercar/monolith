<script lang="ts">
	import Step from '$lib/components/stepper/Step.svelte';
	import Stepper from '$lib/components/stepper/Stepper.svelte';
	import StepperHeader from '$lib/components/stepper/StepperHeader.svelte';
	import type { PageData } from './$types';
	import SelectOrCreateTrackerStep from './components/SelectOrCreateTrackerStep.svelte';
	import VehicleForm from './components/VehicleForm.svelte';

	export let data: PageData;

	let selectedTrackerForm: 'new-tracker' | 'existing-tracker' = 'new-tracker';
</script>

<!--
	TODO:
	this page can only be show if the user can:
	create vehicle
	create tracker
	create sim card
-->
<div class="p-6 max-w-3xl mx-auto">
	<!-- TODO: start = 0 -->
	<Stepper start={1}>
		<StepperHeader additionalClasses="mb-4" />

		<Step>
			<svelte:fragment slot="header">Vehicle Information</svelte:fragment>
			<VehicleForm formSchema={data.createVehicleForm} />
		</Step>

		<Step>
			<svelte:fragment slot="header">Inform your vehicle tracker</svelte:fragment>
			<SelectOrCreateTrackerStep formSchema={data.createTrackerForm} />
		</Step>

		<Step>
			<svelte:fragment slot="header">Set the tracker sim card</svelte:fragment>

			<span class="text-sm">Choose a sim card for the vehicle tracker</span>

			<div class="flex justify-center space-x-4 pb-4">
				<button
					class="btn variant-filled-primary w-full"
					disabled={selectedTrackerForm === 'new-tracker'}
					on:click={() => (selectedTrackerForm = 'new-tracker')}
				>
					create a new sim card
				</button>

				<!-- TODO: start at this step if we have a sim-card on the tracker -->
				<button
					class="btn variant-filled-secondary w-full"
					disabled={selectedTrackerForm === 'existing-tracker'}
					on:click={() => (selectedTrackerForm = 'existing-tracker')}
				>
					use a existing sim card
				</button>
			</div>

			{#if selectedTrackerForm === 'existing-tracker'}
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
