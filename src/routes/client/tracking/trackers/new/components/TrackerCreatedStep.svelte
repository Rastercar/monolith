<script lang="ts">
	import type { StepperState } from '$lib/components/stepper/types';
	import { route } from '$lib/ROUTES';
	import { getContext } from 'svelte';

	interface Props {
		onCreateAnotherClick: () => void;
	}

	const { onCreateAnotherClick }: Props = $props();

	let stepperState = getContext<StepperState>('state');
</script>

<div class="mt-4">
	<p class="mb-4">Your tracker was created</p>
	<button
		class="btn preset-filled-primary-500 mr-4"
		onclick={() => {
			stepperState.current = 0;
			onCreateAnotherClick();
		}}
	>
		create another
	</button>

	<a href={route('/client/tracking/trackers')}>
		<button class="btn preset-filled-secondary-500">see your trackers</button>
	</a>
</div>
