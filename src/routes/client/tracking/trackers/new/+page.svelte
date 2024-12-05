<script lang="ts">
	import type { SimCard } from '$lib/api/sim-card.schema';
	import type { Tracker } from '$lib/api/tracker.schema';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import SetSimCardsStep from '$lib/components/non-generic/step/set-sim-cards-step/SetSimCardsStep.svelte';
	import Step from '$lib/components/stepper/Step.svelte';
	import Stepper from '$lib/components/stepper/Stepper.svelte';
	import StepperHeader from '$lib/components/stepper/StepperHeader.svelte';
	import { route } from '$lib/ROUTES';
	import { getAuthContext } from '$lib/store/auth.svelte';
	import Icon from '@iconify/svelte';
	import CreateTrackerStep from './components/CreateTrackerStep.svelte';
	import TrackerCreatedStep from './components/TrackerCreatedStep.svelte';

	let { data } = $props();

	const auth = getAuthContext();

	let trackerSimCards = $state<SimCard[]>([]);

	let createdTracker: Tracker | null = $state(null);
</script>

<div class="p-6 max-w-5xl mx-auto">
	<TitleAndBreadCrumbsPageHeader
		title="create tracker"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ text: 'tracking' },
			{ href: route('/client/tracking/trackers'), icon: 'mdi:cellphone', text: 'trackers' },
			{ href: route('/client/tracking/trackers/new'), text: 'new' }
		]}
	/>

	<Stepper>
		<StepperHeader extraClasses="my-6" />

		<Step>
			{#snippet header()}
				Tracker Information
			{/snippet}

			<CreateTrackerStep
				{createdTracker}
				updateTrackerFormSchema={data.updateTrackerForm}
				createTrackerFormSchema={data.createTrackerForm}
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
						tracker={createdTracker}
						bind:trackerSimCards
						updateSimCardFormSchema={data.updateSimCardForm}
						createSimCardFormSchema={data.createSimCardForm}
					/>
				{/if}
			</Step>
		{/if}

		<Step>
			{#snippet header()}
				<div class="flex items-center">
					<Icon icon="mdi:check" class="mr-2 text-success-400-600" height={24} />
					Your tracker was created
				</div>
			{/snippet}

			<TrackerCreatedStep onCreateAnotherClick={() => (createdTracker = null)} />
		</Step>
	</Stepper>
</div>
