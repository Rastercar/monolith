<script lang="ts">
	import { isErrorResponseWithErrorCode } from '$lib/api/utils';
	import { apiCreateVehicle } from '$lib/api/vehicle';
	import {
		createVehicleSchema,
		type CreateVehicleBody,
		type Vehicle
	} from '$lib/api/vehicle.schema';
	import ComboBox from '$lib/components/form/ComboBox.svelte';
	import FileInput from '$lib/components/form/FileInput.svelte';
	import MaskedTextInput from '$lib/components/form/MaskedTextInput.svelte';
	import TextArea from '$lib/components/form/TextArea.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import StepperNextStepBtn from '$lib/components/stepper/StepperNextStepBtn.svelte';
	import type { StepperState } from '$lib/components/stepper/types';
	import { carBrands } from '$lib/constants/data/car-brands';
	import { PLATE_IN_USE } from '$lib/constants/error-codes';
	import { getToaster } from '$lib/store/toaster';
	import { createMutation } from '@tanstack/svelte-query';
	import { createEventDispatcher, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface Props {
		formSchema: SuperValidated<Infer<typeof createVehicleSchema>>;
	}

	let { formSchema }: Props = $props();

	const toaster = getToaster();

	const form = superForm(formSchema, {
		validators: zodClient(createVehicleSchema),
		validationMethod: 'oninput'
	});

	const brandOptions = carBrands.map((brand) => ({ value: brand, label: brand }));

	let stepperState: Writable<StepperState> = getContext('state');

	const mutation = createMutation({
		mutationFn: (b: CreateVehicleBody) => apiCreateVehicle(b),
		onError: (e) => {
			isErrorResponseWithErrorCode(e, PLATE_IN_USE)
				? form.validate('plate', { value: '', errors: 'plate in use', update: 'errors' })
				: toaster.error();
		}
	});

	const dispatch = createEventDispatcher<{ 'vehicle-created': Vehicle }>();

	const createVehicle = async () => {
		const validated = await form.validateForm();

		if (!validated.valid) return form.restore({ ...validated, tainted: undefined });

		if (!validated.data.photo) {
			delete validated.data.photo;
		}

		$mutation.mutateAsync(validated.data).then((createdVehicle) => {
			dispatch('vehicle-created', createdVehicle);
			$stepperState.current++;
		});
	};

	let { tainted, allErrors } = $derived(form);

	let canSubmit = $derived($tainted !== undefined && $allErrors.length === 0);
</script>

<span class="text-sm">Fields marked as * are required</span>

<div class="grid grid-cols-2 gap-4 my-4">
	<MaskedTextInput
		{form}
		class="label sm:col-span-1 col-span-2 "
		inputClass="input mb-1 uppercase"
		maskOptions={{
			mask: 'AAA0#00',
			// AAA9A99 (mercosul format) or AAA9999 (br old format)
			definitions: {
				A: { mask: 'a' },
				0: { mask: '0' },
				'#': { mask: /[0-9A-Za-z]/ }
			}
		}}
		field="plate"
		label="Plate *"
	/>

	<ComboBox
		{form}
		class="label sm:col-span-1 col-span-2"
		options={brandOptions}
		field="brand"
		label="Brand *"
	/>

	<TextInput
		{form}
		class="label sm:col-span-1 col-span-2"
		field="model"
		label="Model *"
		maxlength="30"
	/>

	<TextInput
		{form}
		class="label sm:col-span-1 col-span-2"
		field="chassisNumber"
		label="Chassis Number"
		maxlength="30"
	/>

	<TextInput
		{form}
		class="label sm:col-span-1 col-span-2"
		field="modelYear"
		label="Model Year"
		type="text"
		maxlength="4"
	/>

	<TextInput
		{form}
		class="label sm:col-span-1 col-span-2"
		field="fabricationYear"
		label="Fabrication Year"
		type="text"
		maxlength="4"
	/>

	<TextInput
		{form}
		class="label sm:col-span-1 col-span-2"
		field="color"
		label="Color"
		maxlength="12"
	/>

	<FileInput
		{form}
		class="label sm:col-span-1 col-span-2"
		label="Photo"
		field="photoName"
		fileField="photo"
		accept="image/png, image/gif, image/jpeg, image/webp"
		on:file-selected={({ detail: file }) => {
			form.validate('photo', { value: file, update: 'errors', taint: true });
		}}
	/>

	<TextArea
		{form}
		class="label col-span-2"
		field="additionalInfo"
		label="Additional Info"
		rows="6"
		maxlength="500"
	/>
</div>

<StepperNextStepBtn {canSubmit} isLoading={$mutation.isPending} on:click={createVehicle} />
