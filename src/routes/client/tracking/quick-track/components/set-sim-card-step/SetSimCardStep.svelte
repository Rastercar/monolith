<script lang="ts">
	import type { createSimCardSchema } from '$lib/api/sim-card.schema';
	import { apiGetTrackerSimCards } from '$lib/api/tracker';
	import type { Tracker } from '$lib/api/tracker.schema';
	import type { StepperState } from '$lib/components/stepper/types';
	import { trackerModelsDetails } from '$lib/constants/tracker-models';
	import Icon from '@iconify/svelte';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { createQuery } from '@tanstack/svelte-query';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { SuperValidated } from 'sveltekit-superforms';
	import StepperNav from '../StepperNav.svelte';
	import SimCardChooser from './SimCardChooser.svelte';
	import SimCardDisplay from './SimCardDisplay.svelte';

	/**
	 * Tracker to be associated with the sim card to be created or selected
	 */
	export let tracker: Tracker;

	export let formSchema: SuperValidated<typeof createSimCardSchema>;

	const supportedSimCards = trackerModelsDetails[tracker.model].supportedSimCards;

	const query = createQuery({
		queryKey: ['tracker', tracker.id, 'sim-cards'],
		queryFn: () => apiGetTrackerSimCards(tracker.id)
	});

	let deletedOrRemovedSimCardsIds: number[] = [];

	let stepperState: Writable<StepperState> = getContext('state');

	const removeSimCardFromDisplay = (simId: number) => {
		deletedOrRemovedSimCardsIds = [...deletedOrRemovedSimCardsIds, simId];
	};

	$: simCards = ($query.data ?? []).filter((sim) => !deletedOrRemovedSimCardsIds.includes(sim.id));
</script>

<span class="text-sm">
	{supportedSimCards > 1
		? `Choose up to ${supportedSimCards} SIM cards for the vehicle tracker`
		: 'Choose the SIM card for your vehicle tracker'}
</span>

{#if $query.isLoading}
	{#each Array(supportedSimCards) as _, i}
		<section class="card w-full my-4">
			<div class="p-4 space-y-4">
				<div class="placeholder h-12" />
				<div class="placeholder h-12" />
				<div class="placeholder h-12" />
			</div>
		</section>
	{/each}
{:else}
	<div class="card mt-4 p-4">
		<Accordion padding="py-2" spacing="space-y-4">
			{#each Array(supportedSimCards) as _, i}
				{@const simForSlot = simCards[i]}

				<AccordionItem regionControl="bg-surface-200-700-token px-4" spacing="space-y-3">
					<svelte:fragment slot="lead">
						<Icon icon="mdi:sim" width={24} />
					</svelte:fragment>

					<svelte:fragment slot="summary">
						SLOT {i + 1}
					</svelte:fragment>

					<svelte:fragment slot="content">
						<div class="pt-2">
							{#if simForSlot}
								<SimCardDisplay
									simCard={simForSlot}
									on:sim-deleted={() => removeSimCardFromDisplay(simForSlot.id)}
									on:sim-removed={() => removeSimCardFromDisplay(simForSlot.id)}
								/>
							{:else}
								<SimCardChooser
									slot={i + 1}
									{tracker}
									{formSchema}
									on:sim-card-created={() => $query.refetch()}
									on:sim-card-selected={() => $query.refetch()}
								/>
							{/if}
						</div>
					</svelte:fragment>
				</AccordionItem>
			{/each}
		</Accordion>

		<StepperNav
			class="mt-4"
			canSubmit={!$query.isLoading}
			isLoading={$query.isLoading}
			on:click={() => {
				$stepperState.current++;
			}}
		/>
	</div>
{/if}
