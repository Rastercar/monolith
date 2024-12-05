<script lang="ts">
	import {
		updateSimCardSchema,
		type createSimCardSchema,
		type SimCard
	} from '$lib/api/sim-card.schema';
	import type { Tracker } from '$lib/api/tracker.schema';
	import StepperNavigationBtn from '$lib/components/stepper/StepperNavigationBtn.svelte';
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

		createSimCardFormSchema: SuperValidated<Infer<typeof createSimCardSchema>>;
		updateSimCardFormSchema: SuperValidated<Infer<typeof updateSimCardSchema>>;
	}

	let {
		tracker,
		createSimCardFormSchema,
		updateSimCardFormSchema,
		trackerSimCards = $bindable()
	}: Props = $props();

	const supportedSimCards = trackerModelsDetails[tracker.model].supportedSimCards;

	let stepperState = getContext<StepperState>('state');
</script>

<span class="text-sm">
	{supportedSimCards > 1
		? `Choose up to ${supportedSimCards} SIM cards for the vehicle tracker`
		: 'Choose the SIM card for your vehicle tracker'}
</span>

<Accordion collapsible multiple>
	{#each Array(supportedSimCards) as _, i}
		{@const simForSlot = trackerSimCards[i]}

		<Accordion.Item
			panelPadding="px-0"
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
						onSimDeleted={() => {
							trackerSimCards = trackerSimCards.filter((t) => t.id != simForSlot.id);
						}}
						onSimRemoved={() => {
							trackerSimCards = trackerSimCards.filter((t) => t.id != simForSlot.id);
						}}
					/>
				{:else}
					<SimCardChooser
						simSlot={i + 1}
						{tracker}
						{updateSimCardFormSchema}
						{createSimCardFormSchema}
						onSimCardCreated={(sim) => trackerSimCards.push(sim)}
						onSimCardSelected={(sim) => trackerSimCards.push(sim)}
					/>
				{/if}
			{/snippet}
		</Accordion.Item>
	{/each}
</Accordion>

<div class="mt-4 flex justify-between">
	<StepperNavigationBtn
		isStepNextBtn={false}
		onclick={() => {
			stepperState.current--;
		}}
	/>

	<StepperNavigationBtn
		onclick={() => {
			stepperState.current++;
		}}
	/>
</div>
