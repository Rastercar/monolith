<script lang="ts">
	import type { createSimCardSchema } from '$lib/api/sim-card.schema';
	import { apiGetTrackerSimCards } from '$lib/api/tracker';
	import type { Tracker } from '$lib/api/tracker.schema';
	import OptionToggler from '$lib/components/toggler/OptionToggler.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { SuperValidated } from 'sveltekit-superforms';
	import CreateSimCardForm from './CreateSimCardForm.svelte';
	import SelectSimCardDataTable from './SelectSimCardDataTable.svelte';
	import SimCardList from './SimCardList.svelte';

	/**
	 * Tracker to be associated with the sim card to be created or selected
	 */
	// TODO: o que eu tenho que fazer agora é o seguinte:
	// 1- se o tracker tem 1 sim card, ou seja, foi escolhido 1 tracker no passo anterior, exibir opção de continuar
	// 2- se o tracker tem sim card mas o usuario selecionar a opção de selecionar outro ou criar novo, exibir msg
	// de que o sim card do tracker será substituido pelo novo/escolhido
	export let tracker: Tracker;

	export let formSchema: SuperValidated<typeof createSimCardSchema>;

	type action = 'new-sim-card' | 'existing-sim-card' | 'proceed';

	let selectedOption: action = 'new-sim-card';

	const query = createQuery({
		queryKey: ['tracker', tracker.id, 'sim-cards'],
		queryFn: () => apiGetTrackerSimCards(tracker.id)
	});

	const newSimOpt = {
		value: 'new-sim-card',
		label: 'create a new SIM',
		classes: 'btn btn-sm w-full variant-filled-primary'
	};

	const existingSimOpt = {
		value: 'existing-sim-card',
		label: 'use a existing SIM',
		classes: 'btn btn-sm w-full variant-filled-secondary max-w-24'
	};

	const proceedOpt = {
		value: 'proceed',
		label: 'use SIM installed on tracker',
		classes: 'btn btn-sm w-full variant-filled-tertiary max-w-24'
	};

	$: trackerHasSimCard = ($query.data?.length ?? 0) > 0;

	$: canProceed = $query.isLoading || !trackerHasSimCard;

	$: options = canProceed ? [newSimOpt, existingSimOpt] : [newSimOpt, existingSimOpt, proceedOpt];
</script>

<span class="text-sm">Choose a SIM card for the vehicle tracker</span>

<OptionToggler bind:selectedOption additionalClasses="my-4" {options} />

{#if selectedOption === 'proceed'}
	<SimCardList simCards={$query.data ?? []} />
{:else if selectedOption === 'existing-sim-card'}
	<SelectSimCardDataTable
		trackerIdToAssociate={tracker.id}
		showSimSubstitutionAlert={trackerHasSimCard}
	/>
{:else}
	<CreateSimCardForm
		trackerIdToAssociate={tracker.id}
		showSimSubstitutionAlert={trackerHasSimCard}
		{formSchema}
	/>
{/if}
