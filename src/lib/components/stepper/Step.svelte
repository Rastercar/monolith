<script lang="ts">
	import { getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { StepperState } from './types.js';

	/** Provide arbitrary classes to the step header. */
	export let headerAdditionalClasses: string = '';

	export let state: Writable<StepperState> = getContext('state');

	// Register step on init (keep these paired)
	const stepIndex = $state.total;

	$state.total++;

	const cHeader = 'text-2xl font-bold';

	// Unregister step on destroy
	onDestroy(() => {
		$state.total--;
	});

	// Reactive
	$: classesHeader = `${cHeader} ${headerAdditionalClasses}`;
</script>

{#if stepIndex === $state.current}
	<!-- Slot: Header -->
	<header class={classesHeader}>
		<slot name="header">step {stepIndex + 1}</slot>
	</header>

	<!-- Slot: Default -->
	<slot>(step {stepIndex + 1} Content)</slot>
{/if}
