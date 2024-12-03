<script lang="ts">
	import { updateSimCardSchema, type SimCard } from '$lib/api/sim-card.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import { route } from '$lib/ROUTES';
	import { showErrorToast, showSuccessToast } from '$lib/store/toast';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface Props {
		simCard: SimCard;
		formSchema: SuperValidated<Infer<typeof updateSimCardSchema>>;
		onUpdate: () => void;
	}

	let { simCard, formSchema, onUpdate }: Props = $props();

	const form = superForm(formSchema, {
		onUpdate: ({ form }) => {
			if (form.valid) {
				showSuccessToast('sim card updated');
				onUpdate();
			}
		},
		onError: showErrorToast,
		validators: zodClient(updateSimCardSchema)
	});
</script>

<form
	class="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
	method="POST"
	action={route('updateSimCard /client/tracking/sim-cards/[sim_card_id=integer]', {
		sim_card_id: simCard.id.toString()
	})}
	use:form.enhance
>
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

	<TextField {form} name="pin" label="PIN 1" placeholder="0000" maxlength={8} />

	<TextField {form} name="pin2" label="PIN 2" placeholder="0000" maxlength={8} />

	<TextField {form} name="puk" label="PUK 1" placeholder="00000000" maxlength={8} />

	<TextField {form} name="puk2" label="PUK 2" placeholder="00000000" maxlength={8} />

	<div class="col-span-1 sm:col-span-2 md:col-span-3 flex justify-end">
		<LoadableButton isLoading={false} classes="btn preset-filled-primary-500 ml-auto mt-auto">
			update sim card
		</LoadableButton>
	</div>
</form>
