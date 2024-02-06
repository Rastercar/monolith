<script lang="ts">
	import { isErrorResponseWithErrorCode } from '$lib/api/utils';
	import { apiUpdateVehicle } from '$lib/api/vehicle';
	import type { UpdateVehicleBody, Vehicle } from '$lib/api/vehicle.schema';
	import { updateVehicleSchema } from '$lib/api/vehicle.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import ComboBox from '$lib/components/form/ComboBox.svelte';
	import MaskedTextInput from '$lib/components/form/MaskedTextInput.svelte';
	import TextArea from '$lib/components/form/TextArea.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import { carBrands } from '$lib/constants/data/car-brands';
	import { PLATE_IN_USE } from '$lib/constants/error-codes';
	import { getToaster } from '$lib/store/toaster';
	import Icon from '@iconify/svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	export let vehicle: Vehicle;

	export let formSchema: SuperValidated<typeof updateVehicleSchema>;

	const getValuesFromVehicle = () => ({
		plate: vehicle.plate,
		color: vehicle.color ?? '',
		model: vehicle.model ?? '',
		brand: vehicle.brand ?? '',
		chassisNumber: vehicle.chassisNumber ?? '',
		additionalInfo: vehicle.additionalInfo ?? '',
		modelYear: vehicle.modelYear ?? 0,
		fabricationYear: vehicle.fabricationYear ?? 0
	});

	const form = superForm(formSchema, {
		validators: updateVehicleSchema,
		validationMethod: 'oninput'
	});

	const toaster = getToaster();

	const brandOptions = carBrands.map((brand) => ({ value: brand, label: brand }));

	const mutation = createMutation({
		mutationFn: (b: UpdateVehicleBody) => apiUpdateVehicle(vehicle.id, b),
		onError: (e) => {
			// TODO: this is not working for some reason
			isErrorResponseWithErrorCode(e, PLATE_IN_USE)
				? form.validate('plate', { value: '', errors: 'plate in use', update: 'errors' })
				: toaster.error();
		}
	});

	const createVehicle = async () => {
		const validated = await form.validate();

		if (!validated.valid) return form.restore({ ...validated, tainted: undefined });

		const body: Partial<UpdateVehicleBody> = {};

		// TODO: check if this is needed

		// shitty hack, when sending formData with objects with undefined values (eg: {a: undefined})
		// its sent as with the value set to 'undefined' string, what we really want is to exclude
		// fields where the value is undefined or a empty string
		Object.entries(validated.data).forEach(([k, v]) => {
			if (v) body[k as keyof UpdateVehicleBody] = v;
		});

		$mutation.mutateAsync(body as unknown as UpdateVehicleBody).then(() => {
			toaster.success('vehicle updated successfully');

			// TODO:!
			form.reset();
		});
	};

	const dispatch = createEventDispatcher<{ 'edit-canceled': void }>();

	onMount(() => {
		// initialize the form with the vehicle values
		form.reset({ data: getValuesFromVehicle() });
	});

	$: ({ allErrors } = form);

	$: canSubmit = $allErrors.length === 0;
</script>

<div class="p-4 flex">
	<span class="text-lg">Editing vehicle</span>

	<button
		class="btn-icon btn-icon-sm ml-auto variant-filled-primary"
		on:click={() => dispatch('edit-canceled')}
	>
		<Icon icon="mdi:pencil-off" />
	</button>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 pb-4">
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

	<TextArea
		{form}
		class="label col-span-1 sm:col-span-2 md:col-span-3"
		field="additionalInfo"
		label="Additional Info"
		rows="2"
		maxlength="500"
	/>
</div>

<div class="flex px-4 pb-4 justify-end">
	<LoadableButton isLoading={$mutation.isPending}>
		<button class="btn variant-filled-primary" disabled={!canSubmit} on:click={createVehicle}>
			create
		</button>
	</LoadableButton>
</div>
