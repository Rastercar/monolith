<script lang="ts">
	import type { Tracker } from '$lib/api/tracker.schema';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import SetSimCardsStep from '$lib/components/non-generic/step/set-sim-cards-step/SetSimCardsStep.svelte';
	import Step from '$lib/components/stepper/Step.svelte';
	import Stepper from '$lib/components/stepper/Stepper.svelte';
	import StepperHeader from '$lib/components/stepper/StepperHeader.svelte';
	import { getAuthContext } from '$lib/store/auth.svelte';
	import CreateTrackerStep from './components/CreateTrackerStep.svelte';

	let { data } = $props();

	const auth = getAuthContext();

	// TODO: start as null
	let createdTracker: Tracker | null = $state({
		id: 1,
		organizationId: 1,
		model: 'H02'
	} as any);
</script>

<div class="p-6 max-w-5xl mx-auto">
	<TitleAndBreadCrumbsPageHeader
		title="create tracker"
		breadCrumbs={[
			{ href: '/client', icon: 'mdi:home', text: 'home' },
			{ text: 'tracking' },
			{ href: '/client/tracking/trackers', icon: 'mdi:cellphone', text: 'trackers' },
			{ href: '/client/tracking/trackers/new', text: 'new' }
		]}
	/>

	<!-- TODO: rm start -->
	<Stepper start={1}>
		<StepperHeader extraClasses="my-6" />

		<Step>
			{#snippet header()}
				Tracker Information
			{/snippet}

			<CreateTrackerStep
				formSchema={data.createTrackerForm}
				onCreated={(t) => (createdTracker = t)}
			/>
		</Step>

		{#if auth.hasPermission(['UPDATE_TRACKER', 'CREATE_SIM_CARD'])}
			<Step>
				{#snippet header()}
					Tracker SIM cards
				{/snippet}

				{#if createdTracker}
					<SetSimCardsStep
						formSchema={data.createSimCardForm}
						tracker={createdTracker}
						trackerSimCards={[]}
					/>
				{/if}
			</Step>
		{/if}

		<!-- <Step>
			{#snippet header()}
				<div class="flex items-center">
					<Icon icon="mdi:check" class="mr-2 text-success-400-500-token" height={24} />
					Success
				</div>
			{/snippet}

			<TrackerCreatedStep
				on:create-another-clicked={() => {
					createdTracker = null;
				}}
			/>
		</Step> -->
	</Stepper>
</div>
