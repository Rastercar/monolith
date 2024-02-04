<script lang="ts">
	import type { createSimCardSchema } from '$lib/api/sim-card.schema';
	import { apiGetTrackerSimCards } from '$lib/api/tracker';
	import type { Tracker } from '$lib/api/tracker.schema';
	import OptionToggler from '$lib/components/toggler/OptionToggler.svelte';
	import { trackerModelsDetails } from '$lib/constants/tracker-models';
	import Icon from '@iconify/svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { SuperValidated } from 'sveltekit-superforms';
	import CreateSimCardForm from './CreateSimCardForm.svelte';
	import SelectSimCardDataTable from './SelectSimCardDataTable.svelte';
	import SimCardDisplay from './SimCardDisplay.svelte';

	/**
	 * Tracker to be associated with the sim card to be created or selected
	 */
	export let tracker: Tracker;

	export let formSchema: SuperValidated<typeof createSimCardSchema>;

	const supportedSimCards = trackerModelsDetails[tracker.model].supportedSimCards;

	type action = 'new-sim-card' | 'existing-sim-card';

	let selectedOption: action = 'new-sim-card';

	const query = createQuery({
		queryKey: ['tracker', tracker.id, 'sim-cards'],
		queryFn: () => apiGetTrackerSimCards(tracker.id)
	});

	let deletedOrRemovedSimCardsIds: number[] = [];

	const removeSimCardFromDisplay = (simId: number) => {
		// do it with a reassignment to ensure reactivity
		deletedOrRemovedSimCardsIds = [...deletedOrRemovedSimCardsIds, simId];
	};

	$: simCards = ($query.data ?? []).filter((sim) => !deletedOrRemovedSimCardsIds.includes(sim.id));
</script>

<span class="text-sm">
	{supportedSimCards > 1
		? `Choose up to ${supportedSimCards} SIM cards for the vehicle tracker`
		: 'Choose the SIM card for your vehicle tracker'}
</span>

<!-- TODO: query is loading ! -->
{#each Array(supportedSimCards) as _, i}
	{@const simForSlot = simCards[i]}

	{#if simForSlot}
		<SimCardDisplay
			slot={i + 1}
			additionalClasses="my-4"
			simCard={simForSlot}
			on:sim-deleted={() => removeSimCardFromDisplay(simForSlot.id)}
			on:sim-removed={() => removeSimCardFromDisplay(simForSlot.id)}
		/>
		<!-- TODO: -->
	{:else}
		<div class="card p-4 my-4">
			<span class="flex items-center mb-2">
				<Icon icon="mdi:sim" class="mr-4" width={24} /> SLOT {i + 1}
			</span>

			<OptionToggler
				bind:selectedOption
				additionalClasses="my-4"
				options={[
					{
						value: 'new-sim-card',
						label: 'create a new SIM',
						classes: 'btn btn-sm w-full variant-filled-primary'
					},
					{
						value: 'existing-sim-card',
						label: 'use a existing SIM',
						classes: 'btn btn-sm w-full variant-filled-secondary'
					}
				]}
			/>

			{#if selectedOption === 'existing-sim-card'}
				<SelectSimCardDataTable trackerIdToAssociate={tracker.id} />
			{:else}
				<CreateSimCardForm slot={i + 1} trackerIdToAssociate={tracker.id} {formSchema} />
			{/if}
		</div>
	{/if}
{/each}
