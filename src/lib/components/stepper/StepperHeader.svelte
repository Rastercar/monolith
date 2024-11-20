<script lang="ts" module>
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


	

	

	

	

	
	interface Props {
		state?: Writable<StepperState>;
		/** Provide classes to style the stepper header gap. */
		gap?: string;
		/** Provide classes to style the stepper header badges. */
		badge?: string;
		/** Provide classes to style the stepper header active step badge. */
		active?: string;
		/** Provide classes to style the stepper header border. */
		border?: string;
		/** Provide additional classes. */
		additionalClasses?: string;
	}

	let {
		state = getContext('state'),
		gap = 'gap-4',
		badge = 'variant-filled-surface',
		active = 'variant-filled',
		border = 'border-surface-400-500-token',
		additionalClasses = ''
	}: Props = $props();

	/** Provide the transition to used on entry. */
	let transitionIn: TransitionIn = getContext('transitionIn');

	/** Transition params provided to `transitionIn`. */
	let transitionInParams: TransitionParams<TransitionIn> = getContext('transitionInParams');

	/** Provide the transition to used on exit. */
	let transitionOut: TransitionOut = getContext('transitionOut');

	/** Transition params provided to `transitionOut`. */
	let transitionOutParams: TransitionParams<TransitionOut> = getContext('transitionOutParams');

	const cHeader = 'flex items-center border-t mt-[15px]';

	let isActive = $derived((step: number) => step === $state.current);
	let classesBadge = $derived((step: number) => (isActive(step) ? active : badge));

	let classesHeader = $derived(`${cHeader} ${border} ${gap} ${additionalClasses}`);
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
