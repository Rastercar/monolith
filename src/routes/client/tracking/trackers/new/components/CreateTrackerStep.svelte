<!-- @migration-task Error while migrating Svelte code: 'default' is a reserved word in JavaScript and cannot be used here -->
<script lang="ts">
	import type { Tracker, createTrackerSchema } from '$lib/api/tracker.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import CreateTrackerForm from '$lib/components/non-generic/form/CreateTrackerForm.svelte';
	import type { StepperState } from '$lib/components/stepper/types';
	import { createEventDispatcher, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	interface Props {
		createTrackerForm: SuperValidated<Infer<typeof createTrackerSchema>>;
	}

	let { createTrackerForm }: Props = $props();

	let stepperState: Writable<StepperState> = getContext('state');

	const onTrackerCreated = (e: CustomEvent<Tracker>) => {
		dispatch('tracker-created', e.detail);
		$stepperState.current++;
	};

	const dispatch = createEventDispatcher<{ 'tracker-created': Tracker }>();
</script>

<CreateTrackerForm formSchema={createTrackerForm} on:tracker-created={onTrackerCreated}>
	{#snippet default({ isLoading, canSubmit, createTracker })}
		<div  class="flex justify-end"   >
			<LoadableButton
				{isLoading}
				disabled={!canSubmit}
				class="btn variant-filled-primary"
				on:click={createTracker}
			>
				create tracker
			</LoadableButton>
		</div>
	{/snippet}
</CreateTrackerForm>
