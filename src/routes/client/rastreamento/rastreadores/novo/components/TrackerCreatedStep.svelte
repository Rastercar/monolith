<script lang="ts">
	import StepperNavigationBtn from '$lib/components/stepper/StepperNavigationBtn.svelte';
	import type { StepperState } from '$lib/components/stepper/types';
	import { route } from '$lib/ROUTES';
	import { getContext } from 'svelte';

	interface Props {
		onCreateAnotherClick: VoidFunction;
	}

	const { onCreateAnotherClick }: Props = $props();

	let stepperState = getContext<StepperState>('state');
</script>

<div class="mt-4">
	<div class="flex flex-col-reverse md:flex-row gap-4 ml-0">
		<StepperNavigationBtn
			isStepNextBtn={false}
			label="editar cartões SIM"
			onclick={() => {
				stepperState.current--;
			}}
		/>

		<div class="flex space-x-4 justify-between ml-0 md:ml-auto">
			<button
				class="btn preset-filled-primary-500"
				onclick={() => {
					stepperState.current = 0;
					onCreateAnotherClick();
				}}
			>
				cadastrar outro
			</button>

			<a href={route('/client/rastreamento/rastreadores')}>
				<button class="btn preset-filled-secondary-500">ver rastreadores</button>
			</a>
		</div>
	</div>
</div>
