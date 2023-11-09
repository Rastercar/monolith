<script lang="ts" context="module">
	import type { fade } from 'svelte/transition';
	import type { Transition, TransitionParams } from './transition';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type FadeTransition = typeof fade;
	type TransitionIn = Transition;
	type TransitionOut = Transition;
</script>

<script
	lang="ts"
	generics="TransitionIn extends Transition = FadeTransition, TransitionOut extends Transition = FadeTransition"
>
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { dynamicTransition } from './transition';
	import type { StepperState } from './types';

	export let state: Writable<StepperState> = getContext('state');

	/** Provide classes to style the stepper header gap. */
	export let gap: string = 'gap-4';

	/** Provide classes to style the stepper header badges. */
	export let badge: string = 'variant-filled-surface';

	/** Provide classes to style the stepper header active step badge. */
	export let active: string = 'variant-filled';

	/** Provide classes to style the stepper header border. */
	export let border: string = 'border-surface-400-500-token';

	/** Provide additional classes. */
	export let additionalClasses: string = '';

	/** Provide the transition to used on entry. */
	let transitionIn: TransitionIn = getContext('transitionIn');

	/** Transition params provided to `transitionIn`. */
	let transitionInParams: TransitionParams<TransitionIn> = getContext('transitionInParams');

	/** Provide the transition to used on exit. */
	let transitionOut: TransitionOut = getContext('transitionOut');

	/** Transition params provided to `transitionOut`. */
	let transitionOutParams: TransitionParams<TransitionOut> = getContext('transitionOutParams');

	const cHeader = 'flex items-center border-t mt-[15px]';

	$: isActive = (step: number) => step === $state.current;
	$: classesBadge = (step: number) => (isActive(step) ? active : badge);

	$: classesHeader = `${cHeader} ${border} ${gap} ${additionalClasses}`;
</script>

{#if $state.total}
	<header
		class={classesHeader}
		in:dynamicTransition|local={{
			enabled: true,
			transition: transitionIn,
			params: transitionInParams
		}}
		out:dynamicTransition|local={{
			enabled: true,
			transition: transitionOut,
			params: transitionOutParams
		}}
	>
		{#each Array.from(Array($state.total).keys()) as step}
			<div class="-mt-[15px] transition-all duration-300" class:flex-1={isActive(step)}>
				<span class="badge {classesBadge(step)}">
					{isActive(step) ? `step ${step + 1}` : step + 1}
				</span>
			</div>
		{/each}
	</header>
{/if}
