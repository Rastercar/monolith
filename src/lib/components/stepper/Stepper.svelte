<script lang="ts" module>
	import { fade } from 'svelte/transition';
	import type { Transition, TransitionParams } from './transition';

	type FadeTransition = typeof fade;
	type TransitionIn = Transition;
	type TransitionOut = Transition;
</script>

<script
	lang="ts"
	generics="TransitionIn extends Transition = FadeTransition, TransitionOut extends Transition = FadeTransition"
>
	import { createEventDispatcher, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { StepperEvent, StepperState } from './types';

	const dispatch = createEventDispatcher<StepperEvent>();

	/** Provide the initially selected step*/
	export let start = 0;

	/** Provide the transition to used on entry. */
	export let transitionIn: TransitionIn = fade as TransitionIn;

	/** Transition params provided to `transitionIn`. */
	export let transitionInParams: TransitionParams<TransitionIn> = { duration: 100 };

	/** Provide the transition to used on exit. */
	export let transitionOut: TransitionOut = fade as TransitionOut;

	/** Transition params provided to `transitionOut`. */
	export let transitionOutParams: TransitionParams<TransitionOut> = { duration: 100 };

	let state: Writable<StepperState> = writable({ current: start, total: 0 });

	setContext('state', state);
	setContext('stepperDispatch', dispatch);

	setContext('transitionIn', transitionIn);
	setContext('transitionOut', transitionOut);
	setContext('transitionInParams', transitionInParams);
	setContext('transitionOutParams', transitionOutParams);
</script>

<!--
@component
This component is basically a copy paste of the skeleton-ui stepper.

but due to https://github.com/skeletonlabs/skeleton/issues/1780
a lot of patterns and features cannot be done.

so we copy paste the component and add functionality as needed
-->
<slot />
