<script lang="ts">
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { Transition, TransitionParams } from './transition';
	import { dynamicTransition } from './transition';
	import type { StepperEventDispatcher, StepperState } from './types.js';

	type TransitionIn = $$Generic<Transition>;
	type TransitionOut = $$Generic<Transition>;

	export let locked = false;

	/** Arbitrary classes to the step navigation region. */
	export let regionNavigation: string = '';

	export let state: Writable<StepperState> = getContext('state');

	export let gap: string = getContext('gap');
	export let justify = 'justify-between';

	export let buttonBack = 'variant-ghost';
	export let buttonBackLabel = '&larr; Back';

	export let buttonNext = 'variant-filled';
	export let buttonNextLabel = 'Next &rarr;';

	export let buttonComplete = 'variant-filled-primary';
	export let buttonCompleteLabel = 'Complete';

	let dispatchParent = getContext<StepperEventDispatcher>('dispatchParent');

	/** The transition to be used on exit. */
	let transitionOut: TransitionOut = getContext('transitionOut');

	/** The transition to be used on entry. */
	let transitionIn: TransitionIn = getContext('transitionIn');

	/** Transition params provided to `transitionIn`. */
	let transitionInParams: TransitionParams<TransitionIn> = getContext('transitionInParams');

	/** Transition params provided to `transitionOut`. */
	let transitionOutParams: TransitionParams<TransitionOut> = getContext('transitionOutParams');

	const cNavigation = 'flex';

	async function onNext() {
		// Allows any forms to submit before the Step is removed from the DOM:
		// https://github.com/skeletonlabs/skeleton/issues/1328
		await new Promise((resolve) => setTimeout(resolve));

		if (locked) return;

		const stepIndex = $state.current;
		$state.current++;

		dispatchParent('next', { step: stepIndex, state: $state });
		dispatchParent('step', { step: stepIndex, state: $state });
	}

	function onBack() {
		const stepIndex = $state.current;
		$state.current--;

		dispatchParent('back', { step: stepIndex, state: $state });
		dispatchParent('step', { step: stepIndex, state: $state });
	}

	function onComplete() {
		const stepIndex = $state.current;
		dispatchParent('complete', { step: stepIndex, state: $state });
	}

	$: classesNavigation = `${cNavigation} ${justify} ${gap} ${regionNavigation}`;
</script>

<!--
@component
This component is basically a copy paste of the stepper navigation section,
but extracted to a single component.

A stepper can have single navigation sub component or it might have a navigation
component per step, for more fine grained control.
-->
{#if $state.total > 1}
	<div
		class={classesNavigation}
		in:dynamicTransition|local={{
			transition: transitionIn,
			params: transitionInParams,
			enabled: true
		}}
		out:dynamicTransition|local={{
			transition: transitionOut,
			params: transitionOutParams,
			enabled: true
		}}
	>
		<!-- Button: Back -->
		<button class="btn {buttonBack}" on:click={onBack} disabled={$state.current === 0}>
			{@html buttonBackLabel}
		</button>

		{#if $state.current < $state.total - 1}
			<!-- Button: Next -->
			<button class="btn {buttonNext}" on:click={onNext} disabled={locked}>
				{#if locked}
					<Icon icon="mdi:lock" />
				{/if}
				<span>{@html buttonNextLabel}</span>
			</button>
		{:else}
			<!-- Button: Complete -->
			<button class="btn {buttonComplete}" on:click={onComplete} disabled={locked}>
				{@html buttonCompleteLabel}
			</button>
		{/if}
	</div>
{/if}
