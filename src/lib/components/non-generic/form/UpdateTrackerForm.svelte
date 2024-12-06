<script lang="ts">
	import { updateTrackerSchema, type Tracker } from '$lib/api/tracker.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import SelectField from '$lib/components/form/SelectField.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import { TRACKER_MODEL_H02 } from '$lib/constants/tracker-models';
	import { route } from '$lib/ROUTES';
	import { onMount, type Snippet } from 'svelte';
	import type { FormResult, Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ActionData } from '../../../../routes/client/tracking/trackers/[tracker_id=integer]/$types';

	interface Props {
		trackerId: number;

		initialValues?: Tracker;

		formSchema: SuperValidated<Infer<typeof updateTrackerSchema>>;

		children?: Snippet<[{ isLoading: boolean }]>;

		onUpdated: (_: Tracker) => void;
	}

	let { formSchema, trackerId, initialValues, children, onUpdated }: Props = $props();

	const form = superForm(formSchema, {
		validators: zodClient(updateTrackerSchema),
		onUpdate: ({ form, result }) => {
			const action = result.data as FormResult<ActionData>;
			if (form.valid && action.updatedTracker) onUpdated(action.updatedTracker);
		}
	});
	const { submitting: isLoading } = form;

	onMount(() => {
		if (initialValues) form.reset({ data: { ...initialValues } });
	});
</script>

<form
	class="grid grid-cols-1 md:grid-cols-2 gap-4"
	method="POST"
	action={route('updateTracker /client/tracking/trackers/[tracker_id=integer]', {
		tracker_id: trackerId.toString()
	})}
	use:form.enhance
>
	<TextField {form} name="imei" label="IMEI *" maxlength={50} />

	<SelectField
		{form}
		name="model"
		label="Model *"
		options={[{ label: 'H02', value: TRACKER_MODEL_H02 }]}
	/>

	{#if children}
		{@render children({ isLoading: $isLoading })}
	{:else}
		<div class="col-span-1 md:col-span-2 flex justify-end">
			<LoadableButton isLoading={$isLoading} classes="btn preset-filled-primary-500">
				update tracker
			</LoadableButton>
		</div>
	{/if}
</form>
