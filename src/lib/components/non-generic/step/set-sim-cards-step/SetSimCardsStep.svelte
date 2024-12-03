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

	interface Props {
		/**
		 * Tracker to be associated with the sim card to be created or selected
		 */
		tracker: Tracker;

		trackerSimCards: SimCard[];

		formSchema: SuperValidated<Infer<typeof createSimCardSchema>>;
	}

	const { tracker, formSchema, trackerSimCards }: Props = $props();

	const supportedSimCards = trackerModelsDetails[tracker.model].supportedSimCards;

	let deletedOrRemovedSimCardsIds: number[] = [];

	let stepperState = getContext<StepperState>('state');

	const removeSimCardFromDisplay = (simId: number) => {
		deletedOrRemovedSimCardsIds = [...deletedOrRemovedSimCardsIds, simId];
	};

	// TODO: will we query sim cards by trackers from a API or will we expect them in anotherway ?
	//
	// const query = createQuery(() => ({
	// 	queryKey: ['tracker', tracker.id, 'sim-cards'],
	// 	queryFn: () => apiGetTrackerSimCards(tracker.id)
	// }));

	// let simCards = $derived(
	// 	(query.data ?? []).filter((sim) => !deletedOrRemovedSimCardsIds.includes(sim.id))
	// );
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
<div class="card mt-4">
	<Accordion collapsible multiple>
		{#each Array(supportedSimCards) as _, i}
			{@const simForSlot = trackerSimCards[i]}

			<Accordion.Item panelPadding="px-0 py-4" value={`slot-${i + 1}`}>
				{#snippet lead()}
					<Icon icon="mdi:sim" width={24} />
				{/snippet}

				{#snippet control()}
					SLOT {i + 1}
				{/snippet}

				{#snippet panel()}
					{#if simForSlot}
						<!-- <SimCardDisplay
									simCard={simForSlot}
									on:sim-deleted={() => removeSimCardFromDisplay(simForSlot.id)}
									on:sim-removed={() => removeSimCardFromDisplay(simForSlot.id)}
								/> -->
					{:else}
						<SimCardChooser
							simSlot={i + 1}
							{tracker}
							{formSchema}
							onSimCardCreated={(sim) => {
								// TODO: append created sim card to list
								// TODO:
								// query.refetch()
							}}
							onSimCardSelected={() => {
								// TODO:
								// query.refetch()
							}}
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
		extraClasses="mt-4"
		onclick={() => {
			stepperState.current++;
		}}
	/>
</div>
<!-- {/if} -->
