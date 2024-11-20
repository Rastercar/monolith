<script lang="ts">
	import { getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { StepperState } from './types.js';

	

	interface Props {
		/** Provide arbitrary classes to the step header. */
		headerAdditionalClasses?: string;
		state?: Writable<StepperState>;
		header?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	}

	let {
		headerAdditionalClasses = '',
		state = getContext('state'),
		header,
		children
	}: Props = $props();

	// Register step on init (keep these paired)
	const stepIndex = $state.total;

	$state.total++;

	const cHeader = 'text-2xl font-bold';

	// Unregister step on destroy
	onDestroy(() => {
		$state.total--;
	});

	// Reactive
	let classesHeader = $derived(`${cHeader} ${headerAdditionalClasses}`);
</script>

{#if stepIndex === $state.current}
	<!-- Slot: Header -->
	<header class={classesHeader}>
		{#if header}{@render header()}{:else}step {stepIndex + 1}{/if}
	</header>

	<!-- Slot: Default -->
	{#if children}{@render children()}{:else}(step {stepIndex + 1} Content){/if}
{/if}
