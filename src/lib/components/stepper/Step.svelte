<script lang="ts">
	import { getContext, onDestroy, type Snippet } from 'svelte';
	import type { StepperState } from './types.js';

	interface Props {
		classes?: string;

		header?: Snippet;

		children?: Snippet;
	}

	let { classes = 'type-scale-6 mb-2', header, children }: Props = $props();

	const state = getContext<StepperState>('state');

	// Register step on init (keep these paired)
	const stepIndex = state.total;

	state.total++;

	// Unregister step on destroy
	onDestroy(() => {
		state.total--;
	});
</script>

{#if stepIndex === state.current}
	<!-- Slot: Header -->
	<header class={classes}>
		{#if header}{@render header()}{:else}step {stepIndex + 1}{/if}
	</header>

	<!-- Slot: Default -->
	{#if children}{@render children()}{:else}(step {stepIndex + 1} Content){/if}
{/if}
