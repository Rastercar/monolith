<script lang="ts">
	import type { createSimCardSchema, SimCard } from '$lib/api/sim-card.schema';
	import type { Tracker } from '$lib/api/tracker.schema';
	import StepperNextStepBtn from '$lib/components/stepper/StepperNextStepBtn.svelte';
	import type { StepperState } from '$lib/components/stepper/types';
	import { trackerModelsDetails } from '$lib/constants/tracker-models';
	import Icon from '@iconify/svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import { getContext } from 'svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import SimCardChooser from './SimCardChooser.svelte';
	import SimCardDisplay from './SimCardDisplay.svelte';

	interface Props {
		/**
		 * Tracker to be associated with the sim card to be created or selected
		 */
		tracker: Tracker;

		trackerSimCards: SimCard[];

		formSchema: SuperValidated<Infer<typeof createSimCardSchema>>;
	}

	const { tracker, formSchema, trackerSimCards }: Props = $props();

	let simCards = $state(trackerSimCards);

	const supportedSimCards = trackerModelsDetails[tracker.model].supportedSimCards;

	let deletedOrRemovedSimCardsIds: number[] = [];

	let stepperState = getContext<StepperState>('state');

	const removeSimCardFromDisplay = (simId: number) => {
		deletedOrRemovedSimCardsIds = [...deletedOrRemovedSimCardsIds, simId];
	};
</script>

<span class="text-sm">
	{supportedSimCards > 1
		? `Choose up to ${supportedSimCards} SIM cards for the vehicle tracker`
		: 'Choose the SIM card for your vehicle tracker'}
</span>

<!-- {#if query.isLoading}
	{#each Array(supportedSimCards) as _}
		<section class="card w-full my-4">
			<div class="p-4 space-y-4">
				<div class="placeholder h-12"></div>
				<div class="placeholder h-12"></div>
				<div class="placeholder h-12"></div>
			</div>
		</section>
	{/each}
{:else} -->
<Accordion collapsible multiple>
	{#each Array(supportedSimCards) as _, i}
		{@const simForSlot = simCards[i]}

		<Accordion.Item
			panelPadding="px-0 pt-4"
			controlClasses="my-2 bg-surface-200-800"
			value={`slot-${i + 1}`}
		>
			{#snippet lead()}
				<Icon icon="mdi:sim" width={24} />
			{/snippet}

			{#snippet control()}
				SLOT {i + 1}
			{/snippet}

			{#snippet panel()}
				{#if simForSlot}
					<SimCardDisplay
						simCard={simForSlot}
						onSimDeleted={() => removeSimCardFromDisplay(simForSlot.id)}
						onSimRemoved={() => removeSimCardFromDisplay(simForSlot.id)}
					/>
				{:else}
					<SimCardChooser
						simSlot={i + 1}
						{tracker}
						{formSchema}
						onSimCardCreated={(sim) => simCards.push(sim)}
						onSimCardSelected={(sim) => simCards.push(sim)}
					/>
				{/if}
			{/snippet}
		</Accordion.Item>
	{/each}
</Accordion>

<!-- 
		TODO:
		canSubmit={!$query.isLoading}
		isLoading={$query.isLoading}
	-->
<StepperNextStepBtn
	extraClasses="py-4"
	onclick={() => {
		stepperState.current++;
	}}
/>
<!-- {/if} -->
