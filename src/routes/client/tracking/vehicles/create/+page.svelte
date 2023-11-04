<script lang="ts">
	import Step from '$lib/components/stepper/Step.svelte';
	import Stepper from '$lib/components/stepper/Stepper.svelte';
	import StepperHeader from '$lib/components/stepper/StepperHeader.svelte';
	import StepperNavigation from '$lib/components/stepper/StepperNavigation.svelte';
	import type { PageData } from './$types';
	import VehicleFormStep from './components/VehicleFormStep.svelte';

	export let data: PageData;

	let selectedTrackerForm: 'new-tracker' | 'existing-tracker' = 'new-tracker';
</script>

<div class="p-6 max-w-3xl mx-auto">
	<Stepper>
		<StepperHeader />

		<VehicleFormStep formSchema={data.createVehicleForm} />

		<Step locked>
			<svelte:fragment slot="header">Inform your vehicle tracker</svelte:fragment>

			<span class="text-sm">How will you track your vehicle ?</span>

			<div class="flex justify-center space-x-4 pb-4">
				<button
					class="btn variant-filled-primary w-full"
					disabled={selectedTrackerForm === 'new-tracker'}
					on:click={() => (selectedTrackerForm = 'new-tracker')}
				>
					create a new tracker
				</button>

				<button
					class="btn variant-filled-secondary w-full"
					disabled={selectedTrackerForm === 'existing-tracker'}
					on:click={() => (selectedTrackerForm = 'existing-tracker')}
				>
					use a existing tracker
				</button>
			</div>

			{#if selectedTrackerForm === 'existing-tracker'}
				<div class="my-4">select tracker input</div>
			{:else}
				<div class="my-4">create tracker form</div>
			{/if}

			<!-- TODO: decide if we will have this skip functionality -->
			<button class="btn variant-filled-warning w-full"> skip this for now </button>
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

		<!-- TODO: -->
		<StepperNavigation />
	</Stepper>
</div>
