<script lang="ts">
	import type { Tracker, createTrackerSchema } from '$lib/api/tracker.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import CreateTrackerForm from '$lib/components/non-generic/form/CreateTrackerForm.svelte';
	import type { StepperState } from '$lib/components/stepper/types';
	import { createEventDispatcher, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let createTrackerForm: SuperValidated<typeof createTrackerSchema>;

	let stepperState: Writable<StepperState> = getContext('state');

	const onTrackerCreated = (e: CustomEvent<Tracker>) => {
		dispatch('tracker-created', e.detail);
		$stepperState.current++;
	};

	const dispatch = createEventDispatcher<{ 'tracker-created': Tracker }>();
</script>

<CreateTrackerForm formSchema={createTrackerForm} on:tracker-created={onTrackerCreated}>
	<div slot="default" class="flex justify-end" let:isLoading let:canSubmit let:createTracker>
		<LoadableButton
			{isLoading}
			disabled={!canSubmit}
			class="btn variant-filled-primary"
			on:click={createTracker}
		>
			create tracker
		</LoadableButton>
	</div>
</CreateTrackerForm>
