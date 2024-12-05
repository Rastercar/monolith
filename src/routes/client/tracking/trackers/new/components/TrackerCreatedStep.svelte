<script lang="ts">
	import StepperNavigationBtn from '$lib/components/stepper/StepperNavigationBtn.svelte';
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
	<div class="flex">
		<StepperNavigationBtn
			isStepNextBtn={false}
			label="adjust SIM cards"
			onclick={() => {
				stepperState.current--;
			}}
		/>

		<button
			class="btn preset-filled-primary-500 ml-auto mr-4"
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
</div>
