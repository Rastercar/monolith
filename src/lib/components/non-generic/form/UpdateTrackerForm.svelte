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
	import type { ActionData } from '../../../../routes/client/rastreamento/rastreadores/[tracker_id=integer]/$types';

	interface Props {
		trackerId: number;

		extraClasses?: string;

		initialValues?: Tracker;

		formSchema: SuperValidated<Infer<typeof updateTrackerSchema>>;

		children?: Snippet<[{ isLoading: boolean }]>;

		onUpdated: (_: Tracker) => void;
	}

	let {
		formSchema,
		trackerId,
		initialValues,
		extraClasses = '',
		children,
		onUpdated
	}: Props = $props();

	const sForm = superForm(formSchema, {
		validators: zodClient(updateTrackerSchema),
		onUpdate: ({ form, result }) => {
			const action = result.data as FormResult<ActionData>;
			if (form.valid && action.updatedTracker) onUpdated(action.updatedTracker);
		}
	});
	const { submitting: isLoading, form } = sForm;

	onMount(() => {
		if (initialValues) sForm.reset({ data: { ...initialValues } });
	});
</script>

<form
	class={`grid grid-cols-1 md:grid-cols-2 gap-4 ${extraClasses}`}
	method="POST"
	action={route('updateTracker /client/rastreamento/rastreadores/[tracker_id=integer]', {
		tracker_id: trackerId.toString()
	})}
	use:sForm.enhance
>
	<TextField form={sForm} name="imei" label="IMEI *" maxlength={50} />

	<SelectField
		form={sForm}
		name="model"
		label="Modelo *"
		options={[{ label: 'H02', value: TRACKER_MODEL_H02 }]}
	/>

	<!--
		Important: if we dont provide a vehicle field it will be sent as
		null and unintentionally dissasociate the tracker with its vehicle
	-->
	<input type="hidden" name="vehicleId" value={$form.vehicleId} />

	{#if children}
		{@render children({ isLoading: $isLoading })}
	{:else}
		<div class="col-span-1 md:col-span-2 flex justify-end">
			<LoadableButton isLoading={$isLoading} classes="btn preset-filled-primary-500">
				atualizar rastreador
			</LoadableButton>
		</div>
	{/if}
</form>
