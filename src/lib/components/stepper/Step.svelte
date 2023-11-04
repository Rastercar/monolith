<script lang="ts">
	import { getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { Transition } from './transition';
	import type { StepperState } from './types.js';

	type TransitionIn = $$Generic<Transition>;
	type TransitionOut = $$Generic<Transition>;

	/** Provide arbitrary classes to the step header region. */
	export let regionHeader: string = '';

	/** Provide arbitrary classes to the step content region. */
	export let regionContent: string = '';

	export let state: Writable<StepperState> = getContext('state');

	// Register step on init (keep these paired)
	const stepIndex = $state.total;

	$state.total++;

	const cBase = 'space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cContent = 'space-y-4';
	const cNavigation = 'flex';

	// Unregister step on destroy
	onDestroy(() => {
		$state.total--;
	});

	// Reactive
	$: classesBase = `${cBase} ${$$props.class ?? ''}`;
	$: classesHeader = `${cHeader} ${regionHeader}`;
	$: classesContent = `${cContent} ${regionContent}`;
</script>

{#if stepIndex === $state.current}
	<div class="step {classesBase}">
		<!-- Slot: Header -->
		<header class={classesHeader}>
			<slot name="header">step {stepIndex + 1}</slot>
		</header>

		<!-- Slot: Default -->
		<div class={classesContent}>
			<slot>(step {stepIndex + 1} Content)</slot>
		</div>
	</div>
{/if}
