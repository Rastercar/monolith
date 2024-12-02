<script lang="ts">
	import { apiUpdateSimCard } from '$lib/api/sim-card';
	import {
		updateSimCardSchema,
		type SimCard,
		type UpdateSimCardBody
	} from '$lib/api/sim-card.schema';
	import { isAppErrorWithCode } from '$lib/api/utils';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import { PHONE_NUMBER_IN_USE, SSN_IN_USE } from '$lib/constants/error-codes';
	import { showErrorToast, showSuccessToast } from '$lib/store/toast';
	import { createMutation } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface Props {
		simCard: SimCard;
		formSchema: SuperValidated<Infer<typeof updateSimCardSchema>>;
		onUpdate: (_: SimCard) => void;
	}

	let { simCard, formSchema, onUpdate }: Props = $props();

	const form = superForm(formSchema, { validators: zodClient(updateSimCardSchema) });

	const mutation = createMutation(() => ({
		mutationFn: (b: UpdateSimCardBody) => apiUpdateSimCard(simCard.id, b),

		onError: (e) => {
			if (isAppErrorWithCode(e, SSN_IN_USE)) {
				form.validate('ssn', { value: '', errors: 'ssn in use', update: 'errors' });
				return;
			}

			if (isAppErrorWithCode(e, PHONE_NUMBER_IN_USE)) {
				form.validate('phoneNumber', { value: '', errors: 'phone number', update: 'errors' });
				return;
			}

			showErrorToast('TODO:');
		}
	}));

	const updateSimCard = async () => {
		const validated = await form.validateForm();

		if (!validated.valid) return form.restore({ ...validated, tainted: undefined });

		mutation.mutateAsync(validated.data).then((updatedSimCard) => {
			showSuccessToast('sim card updated');
			simCard = updatedSimCard;
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

	let { allErrors } = $derived(form);

	let canSubmit = $derived($allErrors.length === 0);
</script>

<div class="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
	<TextField {form} name="ssn" label="SSN *" placeholder="A123BC678Z" maxlength={50} />

	<TextField
		{form}
		name="phoneNumber"
		label="Phone Number *"
		placeholder="+5599999999"
		maxlength={20}
	/>

	<TextField
		{form}
		name="apnUser"
		label="APN User *"
		placeholder="isp.docomoiot.net"
		maxlength={50}
	/>

	<TextField {form} name="apnPassword" label="APN Password *" placeholder="web" maxlength={50} />

	<TextField {form} name="apnAddress" label="APN Address *" placeholder="web" maxlength={50} />

	<TextField {form} name="pin" label="PIN 1" placeholder="0000" maxlength={20} />

	<TextField {form} name="pin2" label="PIN 2" placeholder="0000" maxlength={20} />

	<TextField {form} name="puk" label="PUK 1" placeholder="00000000" maxlength={20} />

	<TextField {form} name="puk2" label="PUK 2" placeholder="00000000" maxlength={20} />
</div>

<div class="flex justify-end">
	<LoadableButton
		isLoading={false}
		disabled={!canSubmit}
		classes="btn preset-filled-primary-500 ml-auto mt-auto"
		onclick={updateSimCard}
	>
		update sim card
	</LoadableButton>
</div>
