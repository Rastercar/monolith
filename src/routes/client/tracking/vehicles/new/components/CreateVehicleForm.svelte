<script lang="ts">
	import { isErrorResponseWithErrorCode } from '$lib/api/utils';
	import { apiCreateVehicle } from '$lib/api/vehicle';
	import { createVehicleSchema, type CreateVehicleBody } from '$lib/api/vehicle.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import ComboBox from '$lib/components/form/ComboBox.svelte';
	import FileInput from '$lib/components/form/FileInput.svelte';
	import MaskedTextInput from '$lib/components/form/MaskedTextInput.svelte';
	import TextArea from '$lib/components/form/TextArea.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import { carBrands } from '$lib/constants/data/car-brands';
	import { PLATE_IN_USE } from '$lib/constants/error-codes';
	import { getToaster } from '$lib/store/toaster';
	import { clearFileInputsUnderFormWithId } from '$lib/utils/file';
	import { createMutation } from '@tanstack/svelte-query';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let formSchema: SuperValidated<Infer<typeof createVehicleSchema>>;

	const toaster = getToaster();

	const form = superForm(formSchema, {
		validators: zodClient(createVehicleSchema),
		validationMethod: 'oninput'
	});

	const formId = 'create-vehicle-form';

	const brandOptions = carBrands.map((brand) => ({ value: brand, label: brand }));

	const mutation = createMutation({
		mutationFn: (b: CreateVehicleBody) => apiCreateVehicle(b),
		onError: (e) => {
			isErrorResponseWithErrorCode(e, PLATE_IN_USE)
				? form.validate('plate', { value: '', errors: 'plate in use', update: 'errors' })
				: toaster.error();
		}
	});

	const createVehicle = async () => {
		const validated = await form.validateForm();

		if (!validated.valid) return form.restore({ ...validated, tainted: undefined });

		await $mutation.mutateAsync(validated.data);

		toaster.success('vehicle created successfully');
		// TODO!: am i needed ? superforms support files now
		clearFileInputsUnderFormWithId(formId);
		form.reset();
	};

	$: ({ tainted, allErrors } = form);

	$: canSubmit = $tainted !== undefined && $allErrors.length === 0;
</script>

<span class="text-sm">Fields marked as * are required</span>

<div id={formId} class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
	<MaskedTextInput
		{form}
		class="label col-span-1"
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

	<ComboBox {form} class="label col-span-1" options={brandOptions} field="brand" label="Brand *" />

	<TextInput {form} class="label col-span-1" field="model" label="Model *" maxlength="30" />

	<TextInput
		{form}
		class="label col-span-1"
		field="chassisNumber"
		label="Chassis Number"
		maxlength="30"
	/>

	<TextInput
		{form}
		class="label col-span-1"
		field="modelYear"
		label="Model Year"
		type="text"
		maxlength="4"
	/>

	<TextInput
		{form}
		class="label col-span-1"
		field="fabricationYear"
		label="Fabrication Year"
		type="text"
		maxlength="4"
	/>

	<TextInput {form} class="label col-span-1" field="color" label="Color" maxlength="12" />

	<FileInput
		{form}
		class="label col-span-1"
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
		class="label col-span-1 sm:col-span-2 md:col-span-3"
		field="additionalInfo"
		label="Additional Info"
		rows="6"
		maxlength="500"
	/>
</div>

<div class="flex justify-end">
	<LoadableButton
		class="btn variant-filled-primary"
		isLoading={$mutation.isPending}
		disabled={!canSubmit}
		on:click={createVehicle}
	>
		create
	</LoadableButton>
</div>
