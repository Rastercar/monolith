<script lang="ts">
	import { createSimCardSchema, type SimCard } from '$lib/api/sim-card.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import { route } from '$lib/ROUTES';
	import { showErrorToast } from '$lib/store/toast';
	import type { Snippet } from 'svelte';
	import type { FormResult, Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ActionData } from '../../../../routes/client/tracking/sim-cards/new/$types';

	interface Props {
		formSchema: SuperValidated<Infer<typeof createSimCardSchema>>;

		/**
		 * The slot of the tracker the sim card being created is going to occupy
		 *
		 * this is also used to prevents errors when using this component multiple
		 * times on the same page
		 */
		slotNumber?: number;

		/**
		 * The ID of the tracker to associate with the SIM card being created
		 */
		trackerIdToAssociate?: number | undefined;

		children?: Snippet;

		onCreate?: (_: SimCard) => void;
	}

	let { formSchema, slotNumber = 1, onCreate, children }: Props = $props();

	const sForm = superForm(formSchema, {
		id: `sim-card-form-for-slot-${slotNumber ?? 0}`,
		validators: zodClient(createSimCardSchema),
		onUpdate: ({ form, result }) => {
			if (form.valid) {
				const action = result.data as FormResult<ActionData>;
				if (onCreate && action.createdSim) onCreate(action.createdSim);
			}
		},
		onError: showErrorToast
	});

	const { submitting: isLoading } = sForm;
</script>

<form
	class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
	method="POST"
	action={route('createSimCard /client/tracking/sim-cards/new')}
	use:sForm.enhance
>
	<TextField form={sForm} name="ssn" label="SSN *" placeholder="A123BC678Z" maxlength={50} />

	<TextField
		form={sForm}
		name="phoneNumber"
		label="Phone Number *"
		placeholder="+5599999999"
		maxlength={20}
	/>

	<TextField form={sForm} name="apnUser" label="APN User *" maxlength={50} />

	<TextField form={sForm} name="apnPassword" label="APN Password *" maxlength={50} />

	<TextField form={sForm} name="apnAddress" label="APN Address *" maxlength={50} />

	<TextField form={sForm} name="pin" label="PIN 1" placeholder="0000" maxlength={8} />

	<TextField form={sForm} name="pin2" label="PIN 2" placeholder="0000" maxlength={8} />

	<TextField form={sForm} name="puk" label="PUK 1" placeholder="00000000" maxlength={8} />

	<TextField form={sForm} name="puk2" label="PUK 2" placeholder="00000000" maxlength={8} />

	{#if children}
		{@render children()}
	{:else}
		<div class="col-span-1 sm:col-span-2 md:col-span-3 flex justify-end">
			<LoadableButton
				isLoading={$isLoading}
				classes="btn preset-filled-primary-500 ml-auto mt-auto"
			>
				create SIM card
			</LoadableButton>
		</div>
	{/if}
</form>
