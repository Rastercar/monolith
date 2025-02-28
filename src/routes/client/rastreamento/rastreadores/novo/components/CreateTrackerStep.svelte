<script lang="ts">
	import type { createTrackerSchema, Tracker, updateTrackerSchema } from '$lib/api/tracker.schema';
	import CreateTrackerForm from '$lib/components/non-generic/form/CreateTrackerForm.svelte';
	import UpdateTrackerForm from '$lib/components/non-generic/form/UpdateTrackerForm.svelte';
	import type { StepperState } from '$lib/components/stepper/types';
	import { getContext } from 'svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	interface Props {
		/**
		 * The tracker that was created by this step and
		 * might be update if the user navigates back
		 */
		createdTracker?: Tracker | null;

		createTrackerFormSchema: SuperValidated<Infer<typeof createTrackerSchema>>;
		updateTrackerFormSchema: SuperValidated<Infer<typeof updateTrackerSchema>>;

		onCreated: (tracker: Tracker) => void;
	}

	let { createTrackerFormSchema, updateTrackerFormSchema, createdTracker, onCreated }: Props =
		$props();

	let stepperState: StepperState = getContext('state');
</script>

{#if createdTracker}
	<UpdateTrackerForm
		trackerId={createdTracker.id}
		initialValues={createdTracker}
		formSchema={updateTrackerFormSchema}
		onUpdated={(tracker) => {
			stepperState.current++;
			onCreated(tracker);
		}}
	/>
{:else}
	<CreateTrackerForm
		formSchema={createTrackerFormSchema}
		onCreated={(tracker) => {
			stepperState.current++;
			onCreated(tracker);
		}}
	/>
{/if}
