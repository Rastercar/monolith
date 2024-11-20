<script lang="ts">
	import type { Tracker } from '$lib/api/tracker.schema';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import SetSimCardsStep from '$lib/components/non-generic/step/set-sim-cards-step/SetSimCardsStep.svelte';
	import Step from '$lib/components/stepper/Step.svelte';
	import Stepper from '$lib/components/stepper/Stepper.svelte';
	import StepperHeader from '$lib/components/stepper/StepperHeader.svelte';
	import { hasPermission } from '$lib/store/auth.svelte';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import CreateTrackerStep from './components/CreateTrackerStep.svelte';
	import TrackerCreatedStep from './components/TrackerCreatedStep.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let createdTracker: Tracker | null = $state(null);
</script>

<PermissionGuard requiredPermissions={['CREATE_TRACKER']}>
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
				{#snippet header()}
								Tracker Information
							{/snippet}
				<CreateTrackerStep
					createTrackerForm={data.createTrackerForm}
					on:tracker-created={(e) => (createdTracker = e.detail)}
				/>
			</Step>

			{#if $hasPermission(['UPDATE_TRACKER', 'CREATE_SIM_CARD'])}
				<Step>
					{#snippet header()}
										Tracker SIM cards
									{/snippet}
					{#if createdTracker}
						<SetSimCardsStep formSchema={data.createSimCardForm} tracker={createdTracker} />
					{/if}
				</Step>
			{/if}

			<Step>
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
			</Step>
		</Stepper>
	</div>
</PermissionGuard>
