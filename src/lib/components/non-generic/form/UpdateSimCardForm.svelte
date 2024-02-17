<script lang="ts">
	import { apiUpdateSimCard } from '$lib/api/sim-card';
	import {
		updateSimCardSchema,
		type SimCard,
		type UpdateSimCardBody
	} from '$lib/api/sim-card.schema';
	import { isErrorResponseWithErrorCode } from '$lib/api/utils';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import { PHONE_NUMBER_IN_USE, SSN_IN_USE } from '$lib/constants/error-codes';
	import { getToaster } from '$lib/store/toaster';
	import { createMutation } from '@tanstack/svelte-query';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	export let simCard: SimCard;

	export let formSchema: SuperValidated<typeof updateSimCardSchema>;

	const form = superForm(formSchema, { validators: updateSimCardSchema });

	const toaster = getToaster();

	const mutation = createMutation({
		mutationFn: (b: UpdateSimCardBody) => apiUpdateSimCard(simCard.id, b),

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

	const dispatch = createEventDispatcher<{ 'sim-card-updated': SimCard }>();

	const updateTracker = async () => {
		const validated = await form.validate();

		if (!validated.valid) return form.restore({ ...validated, tainted: undefined });

		$mutation.mutateAsync(validated.data).then((updatedSimCard) => {
			toaster.success('sim card updated');
			simCard = updatedSimCard;
			dispatch('sim-card-updated', updatedSimCard);
		});
	};

	onMount(() => {
		form.reset({
			data: {
				ssn: simCard.ssn,
				phoneNumber: simCard.phoneNumber,
				apnUser: simCard.apnUser,
				apnAddress: simCard.apnAddress,
				apnPassword: simCard.apnPassword,
				pin: simCard.pin,
				pin2: simCard.pin2,
				puk: simCard.puk,
				puk2: simCard.puk2
			}
		});
	});

	$: ({ allErrors } = form);

	$: canSubmit = $allErrors.length === 0;
</script>

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

<div class="flex justify-end">
	<LoadableButton
		isLoading={false}
		disabled={!canSubmit}
		class="btn variant-filled-primary ml-auto mt-auto"
		on:click={updateTracker}
	>
		update tracker
	</LoadableButton>
</div>
