<script lang="ts">
	import {
		createSimCardSchema,
		type CreateSimCardBody,
		type SimCard
	} from '$lib/api/sim-card.schema';
	import { apiCreateTracker } from '$lib/api/tracker';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import type { StepperState } from '$lib/components/stepper/types';
	import { getToaster } from '$lib/store/toaster';
	import { createMutation } from '@tanstack/svelte-query';
	import { createEventDispatcher, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import StepperNav from '../StepperNav.svelte';
	import SimSubstitutionAlert from './SimSubstitutionAlert.svelte';

	export let formSchema: SuperValidated<typeof createSimCardSchema>;

	export let showSimSubstitutionAlert = false;

	/**
	 * The ID of the tracker to associate with the SIM card being created
	 */
	export let trackerIdToAssociate: number;

	const form = superForm(formSchema, { validators: createSimCardSchema });

	const toaster = getToaster();

	let stepperState: Writable<StepperState> = getContext('state');

	// TODO: finish me !
	const mutation = createMutation({
		mutationFn: (b: CreateSimCardBody) => apiCreateTracker(b as any)

		// onError: (e) => {
		// 	isErrorResponseWithErrorCode(e, IMEI_IN_USE)
		// 		? form.validate('imei', { value: '', errors: 'imei in use', update: 'errors' })
		// 		: toaster.error();
		// }
	});

	const dispatch = createEventDispatcher<{ 'sim-card-created': SimCard }>();

	const createTracker = async () => {
		const validated = await form.validate();

		if (!validated.valid) return form.restore({ ...validated, tainted: undefined });

		validated.data.trackerId = trackerIdToAssociate;

		$mutation.mutateAsync(validated.data).then((createdTracker) => {
			// TODO:!
			dispatch('sim-card-created', createdTracker as any);
			$stepperState.current++;
		});
	};

	$: ({ tainted, allErrors } = form);

	$: canSubmit = $tainted !== undefined && $allErrors.length === 0;
</script>

{#if showSimSubstitutionAlert}
	<SimSubstitutionAlert />
{/if}

<div class="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
	<TextInput {form} field="ssn" label="SSN *" placeholder="A123BC678Z" maxlength="50" />

	<TextInput
		{form}
		field="phoneNumber"
		label="Phone Number *"
		placeholder="+5599999999"
		maxlength="20"
	/>

	<TextInput
		{form}
		field="apnUser"
		label="APN User *"
		placeholder="isp.docomoiot.net"
		maxlength="50"
	/>

	<TextInput {form} field="apnPassword" label="APN Password *" placeholder="web" maxlength="50" />

	<TextInput {form} field="apnAddress" label="APN Address *" placeholder="web" maxlength="50" />

	<TextInput {form} field="pin" label="PIN 1" placeholder="0000" maxlength="20" />

	<TextInput {form} field="pin2" label="PIN 2" placeholder="0000" maxlength="20" />

	<TextInput {form} field="puk" label="PUK 1" placeholder="00000000" maxlength="20" />

	<TextInput {form} field="puk2" label="PUK 2" placeholder="00000000" maxlength="20" />
</div>

<StepperNav {canSubmit} isLoading={$mutation.isPending} on:click={createTracker} />
