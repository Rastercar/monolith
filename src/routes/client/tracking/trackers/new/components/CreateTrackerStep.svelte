<script lang="ts">
	import type { createTrackerSchema, Tracker, updateTrackerSchema } from '$lib/api/tracker.schema';
	import CreateTrackerForm from '$lib/components/non-generic/form/CreateTrackerForm.svelte';
	import UpdateTrackerForm from '$lib/components/non-generic/form/UpdateTrackerForm.svelte';
	import type { StepperState } from '$lib/components/stepper/types';
	import { getContext } from 'svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	interface Props {
		createTrackerFormSchema: SuperValidated<Infer<typeof createTrackerSchema>>;
		updateTrackerFormSchema: SuperValidated<Infer<typeof updateTrackerSchema>>;

		onCreated: (tracker: Tracker) => void;
	}

	let { createTrackerFormSchema, updateTrackerFormSchema, onCreated }: Props = $props();

	let stepperState: StepperState = getContext('state');
</script>

<!-- TODO: IF TRACKER WAS CREATED SHOW UPDATE FORM WITH TRACKER DATA -->
<CreateTrackerForm
	formSchema={createTrackerFormSchema}
	onCreated={(tracker) => {
		stepperState.current++;
		onCreated(tracker);
	}}
/>

<UpdateTrackerForm formSchema={updateTrackerFormSchema} onUpdated={() => {}} />
