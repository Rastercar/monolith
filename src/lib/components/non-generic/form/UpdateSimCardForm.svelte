<script lang="ts">
	import { updateSimCardSchema, type SimCard } from '$lib/api/sim-card.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import { route } from '$lib/ROUTES';
	import { showErrorToast } from '$lib/store/toast';
	import { onMount } from 'svelte';
	import type { FormResult, Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ActionData } from '../../../../routes/client/rastreamento/cartoes-sim/[sim_card_id=integer]/$types';

	interface Props {
		simCardId: number;
		initialValues?: SimCard;

		formSchema: SuperValidated<Infer<typeof updateSimCardSchema>>;
		extraClasses?: string;
		onUpdate: (_: SimCard) => void;
	}

	let { simCardId, initialValues, formSchema, extraClasses = '', onUpdate }: Props = $props();

	const sForm = superForm(formSchema, {
		validators: zodClient(updateSimCardSchema),
		onUpdate: ({ form, result }) => {
			if (form.valid) {
				const action = result.data as FormResult<ActionData>;
				if (form.valid && action.updatedSimCard) onUpdate(action.updatedSimCard);
			}
		},
		onError: showErrorToast
	});
	const { submitting: isLoading, form } = sForm;

	onMount(() => {
		if (initialValues) sForm.reset({ data: { ...initialValues } });
	});
</script>

<form
	class={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ${extraClasses}`}
	method="POST"
	action={route('updateSimCard /client/rastreamento/cartoes-sim/[sim_card_id=integer]', {
		sim_card_id: simCardId.toString()
	})}
	use:sForm.enhance
>
	<TextField form={sForm} name="ssn" label="SSN *" placeholder="A123BC678Z" maxlength={50} />

	<TextField
		form={sForm}
		name="phoneNumber"
		label="Telefone *"
		placeholder="+5599999999"
		maxlength={20}
	/>

	<TextField form={sForm} name="apnUser" label="APN Usuário *" maxlength={50} />

	<TextField form={sForm} name="apnPassword" label="APN Senha *" maxlength={50} />

	<TextField form={sForm} name="apnAddress" label="APN Endereço *" maxlength={50} />

	<TextField form={sForm} name="pin" label="PIN 1" placeholder="0000" maxlength={8} />

	<TextField form={sForm} name="pin2" label="PIN 2" placeholder="0000" maxlength={8} />

	<TextField form={sForm} name="puk" label="PUK 1" placeholder="00000000" maxlength={8} />

	<TextField form={sForm} name="puk2" label="PUK 2" placeholder="00000000" maxlength={8} />

	<!--
		Important: if we dont provide a vehicle tracker field it will be sent as
		null and unintentionally dissasociate the tracker with its vehicle
		-->
	<input type="hidden" name="vehicleTrackerId" value={$form.vehicleTrackerId} />

	<div class="col-span-1 sm:col-span-2 md:col-span-3 flex justify-end">
		<LoadableButton isLoading={$isLoading} classes="btn preset-filled-primary-500 ml-auto mt-auto">
			atualizar cartão SIM
		</LoadableButton>
	</div>
</form>
