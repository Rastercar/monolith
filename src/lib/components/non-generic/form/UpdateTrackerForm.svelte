<script lang="ts">
	import { apiUpdateTracker } from '$lib/api/tracker';
	import {
		updateTrackerSchema,
		type Tracker,
		type UpdateTrackerBody
	} from '$lib/api/tracker.schema';
	import { isErrorResponseWithErrorCode } from '$lib/api/utils';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import SelectInput from '$lib/components/form/SelectInput.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import { IMEI_IN_USE } from '$lib/constants/error-codes';
	import { TRACKER_MODEL_H02 } from '$lib/constants/tracker-models';
	import { getToaster } from '$lib/store/toaster';
	import { createMutation } from '@tanstack/svelte-query';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	export let tracker: Tracker;

	export let formSchema: SuperValidated<typeof updateTrackerSchema>;

	const form = superForm(formSchema, { validators: updateTrackerSchema });

	const toaster = getToaster();

	const mutation = createMutation({
		mutationFn: (b: UpdateTrackerBody) => apiUpdateTracker(tracker.id, b),

		onError: (e) => {
			isErrorResponseWithErrorCode(e, IMEI_IN_USE)
				? form.validate('imei', { value: '', errors: 'imei in use', update: 'errors' })
				: toaster.error();
		}
	});

	const dispatch = createEventDispatcher<{ 'tracker-updated': Tracker }>();

	const updateTracker = async () => {
		const validated = await form.validate();

		if (!validated.valid) return form.restore({ ...validated, tainted: undefined });

		$mutation.mutateAsync(validated.data).then((updatedTracker) => {
			toaster.success('tracker updated');
			tracker = updatedTracker;
			dispatch('tracker-updated', updatedTracker);
		});
	};

	onMount(() => {
		form.reset({ data: { model: tracker.model, imei: tracker.imei } });
	});

	$: ({ allErrors, form: xd } = form);

	$: canSubmit = $allErrors.length === 0;
</script>

<div class="mb-4 flex gap-4">
	<TextInput class="label" {form} field="imei" label="IMEI *" maxlength="50" />

	<SelectInput
		{form}
		class="label"
		options={[{ label: 'H02', value: TRACKER_MODEL_H02 }]}
		field="model"
		label="Model *"
	/>

	<LoadableButton
		isLoading={false}
		disabled={!canSubmit}
		class="btn variant-filled-primary ml-auto mt-auto"
		on:click={updateTracker}
	>
		update tracker
	</LoadableButton>
</div>
