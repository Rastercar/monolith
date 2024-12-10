<script lang="ts">
	import { createTrackerSchema, type Tracker } from '$lib/api/tracker.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import SelectField from '$lib/components/form/SelectField.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import { TRACKER_MODEL_H02 } from '$lib/constants/tracker-models';
	import { route } from '$lib/ROUTES';
	import type { Snippet } from 'svelte';
	import type { FormResult, Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ActionData } from '../../../../routes/client/tracking/trackers/new/$types';

	interface Props {
		formSchema: SuperValidated<Infer<typeof createTrackerSchema>>;

		children?: Snippet<[{ isLoading: boolean }]>;

		onCreated: (_: Tracker) => void;
	}

	let { formSchema, children, onCreated }: Props = $props();

	const sForm = superForm(formSchema, {
		validators: zodClient(createTrackerSchema),
		onUpdate: ({ form, result }) => {
			const action = result.data as FormResult<ActionData>;

			if (form.valid && action.createdTracker) onCreated(action.createdTracker);
		}
	});
	const { submitting: isLoading } = sForm;
</script>

<form
	class="grid grid-cols-2 gap-4"
	method="POST"
	action={route('createTracker /client/tracking/trackers/new')}
	use:sForm.enhance
>
	<TextField form={sForm} name="imei" label="IMEI *" maxlength={50} />

	<SelectField
		form={sForm}
		options={[{ label: 'H02', value: TRACKER_MODEL_H02 }]}
		name="model"
		label="Model *"
	/>

	{#if children}
		{@render children({ isLoading: $isLoading })}
	{:else}
		<div class="col-span-2 flex justify-end">
			<LoadableButton isLoading={$isLoading} classes="btn preset-filled-primary-500">
				create tracker
			</LoadableButton>
		</div>
	{/if}
</form>
