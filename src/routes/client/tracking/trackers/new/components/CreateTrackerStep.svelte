<script lang="ts">
	import type { createTrackerSchema, Tracker } from '$lib/api/tracker.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import CreateTrackerForm from '$lib/components/non-generic/form/CreateTrackerForm.svelte';
	import type { StepperState } from '$lib/components/stepper/types';
	import { getContext } from 'svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	interface Props {
		formSchema: SuperValidated<Infer<typeof createTrackerSchema>>;
		onCreated: (tracker: Tracker) => void;
	}

	let { formSchema, onCreated }: Props = $props();

	let stepperState: StepperState = getContext('state');
</script>

<CreateTrackerForm
	{formSchema}
	onCreated={(tracker) => {
		stepperState.current++;
		onCreated(tracker);
	}}
>
	{#snippet children({ isLoading })}
		<div class="flex justify-end col-span-2">
			<LoadableButton {isLoading} classes="btn preset-filled-primary-500">
				create tracker
			</LoadableButton>
		</div>
	{/snippet}
</CreateTrackerForm>
