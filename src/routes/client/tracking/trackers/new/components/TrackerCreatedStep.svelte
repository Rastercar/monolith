<script lang="ts">
	import type { StepperState } from '$lib/components/stepper/types';
	import { createEventDispatcher, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	let dispatch = createEventDispatcher<{ 'create-another-clicked': void }>();

	let stepperState: Writable<StepperState> = getContext('state');
</script>

<div class="mt-4">
	<p class="mb-4">Your tracker was created successfully</p>
	<button
		class="btn variant-filled-primary mr-4"
		onclick={() => {
			$stepperState.current = 0;
			dispatch('create-another-clicked');
		}}
	>
		create another
	</button>

	<a href="/client/tracking/trackers/">
		<button class="btn variant-filled-secondary">see your trackers</button>
	</a>
</div>
