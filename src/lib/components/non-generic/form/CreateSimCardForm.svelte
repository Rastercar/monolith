<script lang="ts">
	import { apiCreateSimCard } from '$lib/api/sim-card';
	import {
		createSimCardSchema,
		type CreateSimCardBody,
		type SimCard
	} from '$lib/api/sim-card.schema';
	import { isErrorResponseWithErrorCode } from '$lib/api/utils';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import { PHONE_NUMBER_IN_USE, SSN_IN_USE } from '$lib/constants/error-codes';
	import { getToaster } from '$lib/store/toaster';
	import { createMutation } from '@tanstack/svelte-query';
	import { createEventDispatcher } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	export let formSchema: SuperValidated<typeof createSimCardSchema>;

	export let slot: number;

	/**
	 * The ID of the tracker to associate with the SIM card being created
	 */
	export let trackerIdToAssociate: number;

	const form = superForm(formSchema, {
		validators: createSimCardSchema,
		id: `sim-card-form-for-slot-${slot}`
	});

	const toaster = getToaster();

	const mutation = createMutation({
		mutationFn: (b: CreateSimCardBody) => apiCreateSimCard(b),

		onError: (e) => {
			if (isErrorResponseWithErrorCode(e, SSN_IN_USE)) {
				form.validate('ssn', { value: '', errors: 'ssn in use', update: 'errors' });
				return;
			}

			if (isErrorResponseWithErrorCode(e, PHONE_NUMBER_IN_USE)) {
				form.validate('phoneNumber', { value: '', errors: 'phone number', update: 'errors' });
				return;
			}

			toaster.error();
		}
	});

	const dispatch = createEventDispatcher<{ 'sim-card-created': SimCard }>();

	const createSimCard = async () => {
		const validated = await form.validate();

		if (!validated.valid) return form.restore({ ...validated, tainted: undefined });

		validated.data.trackerId = trackerIdToAssociate;

		$mutation.mutateAsync(validated.data).then((createdTracker) => {
			dispatch('sim-card-created', createdTracker);
		});
	};

	$: ({ tainted, allErrors } = form);

	$: canSubmit = $tainted !== undefined && $allErrors.length === 0;
</script>

<div>
	<div class="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
		<TextInput
			{form}
			class="label mb-1"
			field="ssn"
			label="SSN *"
			placeholder="A123BC678Z"
			maxlength="50"
		/>

		<TextInput
			{form}
			class="label mb-1"
			field="phoneNumber"
			label="Phone Number *"
			placeholder="+5599999999"
			maxlength="20"
		/>

		<TextInput
			{form}
			class="label mb-1"
			field="apnUser"
			label="APN User *"
			placeholder="isp.docomoiot.net"
			maxlength="50"
		/>

		<TextInput
			{form}
			class="label mb-1"
			field="apnPassword"
			label="APN Password *"
			placeholder="web"
			maxlength="50"
		/>

		<TextInput
			{form}
			class="label mb-1"
			field="apnAddress"
			label="APN Address *"
			placeholder="web"
			maxlength="50"
		/>

		<TextInput
			{form}
			class="label mb-1"
			field="pin"
			label="PIN 1"
			placeholder="0000"
			maxlength="20"
		/>

		<TextInput
			{form}
			class="label mb-1"
			field="pin2"
			label="PIN 2"
			placeholder="0000"
			maxlength="20"
		/>

		<TextInput
			{form}
			class="label mb-1"
			field="puk"
			label="PUK 1"
			placeholder="00000000"
			maxlength="20"
		/>

		<TextInput
			{form}
			class="label mb-1"
			field="puk2"
			label="PUK 2"
			placeholder="00000000"
			maxlength="20"
		/>
	</div>

	<div class="flex mt-4 justify-end">
		<button class="btn variant-filled-primary" disabled={!canSubmit} on:click={createSimCard}>
			create SIM card
		</button>
	</div>
</div>
