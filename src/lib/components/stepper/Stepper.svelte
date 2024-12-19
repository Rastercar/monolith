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
	import { setContext, type Snippet } from 'svelte';

	interface Props {
		/** Provide the initially selected step*/
		start?: number;

		/** Provide the transition to used on entry. */
		transitionIn?: TransitionIn;

		/** Transition params provided to `transitionIn`. */
		transitionInParams?: TransitionParams<TransitionIn>;

		/** Provide the transition to used on exit. */
		transitionOut?: TransitionOut;

		/** Transition params provided to `transitionOut`. */
		transitionOutParams?: TransitionParams<TransitionOut>;

		children?: Snippet;
	}

	let {
		start = 0,
		transitionIn = fade as TransitionIn,
		transitionInParams = { duration: 100 },
		transitionOut = fade as TransitionOut,
		transitionOutParams = { duration: 100 },
		children
	}: Props = $props();

	let state = $state({ current: start, total: 0 });

	setContext('state', state);
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
{@render children?.()}
