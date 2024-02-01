<script lang="ts">
	import type { SimCard } from '$lib/api/sim-card.schema';

	import StepperNav from '../StepperNav.svelte';
	import SimCardDisplay from './SimCardDisplay.svelte';

	export let simCards: SimCard[];
</script>

<p class="mb-4">The following SIM cards are installed on the tracker</p>

<div class="flex flex-col space-y-4 mb-4">
	{#each simCards ?? [] as simCard}
		<SimCardDisplay {simCard} />
	{/each}
</div>

<!-- TODO: now what ? XD -->
<StepperNav canSubmit on:click={() => console.log('!')} />
