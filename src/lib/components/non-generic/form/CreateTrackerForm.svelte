<script lang="ts">
	import { apiCreateTracker } from '$lib/api/tracker';
	import {
		createTrackerSchema,
		type CreateTrackerBody,
		type Tracker
	} from '$lib/api/tracker.schema';
	import { isErrorResponseWithErrorCode } from '$lib/api/utils';
	import SelectInput from '$lib/components/form/SelectInput.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import { IMEI_IN_USE } from '$lib/constants/error-codes';
	import { TRACKER_MODEL_H02 } from '$lib/constants/tracker-models';
	import { getToaster } from '$lib/store/toaster';
	import { createMutation } from '@tanstack/svelte-query';
	import { createEventDispatcher } from 'svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let formSchema: SuperValidated<Infer<typeof createTrackerSchema>>;

	/**
	 * The ID of the vehicle to associate to the tracker
	 */
	export let vehicleIdToAssociate: number | undefined = undefined;

	const form = superForm(formSchema, { validators: zodClient(createTrackerSchema) });

	const toaster = getToaster();

	const mutation = createMutation({
		mutationFn: (b: CreateTrackerBody) => apiCreateTracker(b),

		onError: (e) => {
			isErrorResponseWithErrorCode(e, IMEI_IN_USE)
				? form.validate('imei', { value: '', errors: 'imei in use', update: 'errors' })
				: toaster.error();
		}
	});

	const dispatch = createEventDispatcher<{ 'tracker-created': Tracker }>();

	const createTracker = async () => {
		const validated = await form.validateForm();

		if (!validated.valid) return form.restore({ ...validated, tainted: undefined });

		if (vehicleIdToAssociate) validated.data.vehicleId = vehicleIdToAssociate;

		$mutation.mutateAsync(validated.data).then((createdTracker) => {
			dispatch('tracker-created', createdTracker);
			form.reset();
		});
	};

	$: ({ tainted, allErrors } = form);

	$: canSubmit = $tainted !== undefined && $allErrors.length === 0;
</script>

<div class="mb-4">
	<TextInput {form} field="imei" label="IMEI *" maxlength="50" />

	<SelectInput
		{form}
		options={[{ label: 'H02', value: TRACKER_MODEL_H02 }]}
		field="model"
		label="Model *"
	/>
</div>

<slot isLoading={$mutation.isPending} {canSubmit} {createTracker} />
