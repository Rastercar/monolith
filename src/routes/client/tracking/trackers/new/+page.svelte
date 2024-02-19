<script lang="ts">
	import type { Tracker } from '$lib/api/tracker.schema';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import SetSimCardsStep from '$lib/components/non-generic/step/set-sim-cards-step/SetSimCardsStep.svelte';
	import Step from '$lib/components/stepper/Step.svelte';
	import Stepper from '$lib/components/stepper/Stepper.svelte';
	import StepperHeader from '$lib/components/stepper/StepperHeader.svelte';
	import type { PageData } from './$types';
	import CreateTrackerStep from './components/CreateTrackerStep.svelte';

	export let data: PageData;

	let createdTracker: Tracker | null = null;
</script>

<div class="p-6 max-w-4xl mx-auto">
	<TitleAndBreadCrumbsPageHeader
		margin="mb-8"
		title="create tracker"
		breadCrumbs={[
			{ href: '/client', icon: 'mdi:home', text: 'home' },
			{ text: 'tracking' },
			{ href: '/client/tracking/trackers', icon: 'mdi:cellphone', text: 'trackers' },
			{ href: '/client/tracking/trackers/new', text: 'new' }
		]}
	/>

	<Stepper>
		<StepperHeader additionalClasses="mb-4" />

		<Step>
			<svelte:fragment slot="header">Tracker Information</svelte:fragment>
			<CreateTrackerStep
				createTrackerForm={data.createTrackerForm}
				on:tracker-created={(e) => (createdTracker = e.detail)}
			/>
		</Step>

		<Step>
			<svelte:fragment slot="header">Tracker SIM cards</svelte:fragment>
			{#if createdTracker}
				<SetSimCardsStep formSchema={data.createSimCardForm} tracker={createdTracker} />
			{/if}
		</Step>
	</Stepper>
</div>
