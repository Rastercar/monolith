<script lang="ts">
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import { updateVehicleSchema } from '$lib/api/vehicle.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import MaskedTextField from '$lib/components/form/MaskedTextField.svelte';
	import TextAreaField from '$lib/components/form/TextAreaField.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import { carBrands } from '$lib/constants/data/car-brands';
	import { route } from '$lib/ROUTES';
	import { showErrorToast } from '$lib/store/toast';
	import Icon from '@iconify/svelte';
	import type { FormResult, Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ActionData } from '../../$types';

	interface Props {
		vehicle: Vehicle;
		formSchema: SuperValidated<Infer<typeof updateVehicleSchema>>;
		onEditCanceled: () => void;
		onVehicleUpdated: (_: Vehicle) => void;
	}

	let { vehicle, formSchema, onEditCanceled, onVehicleUpdated }: Props = $props();

	const getValuesFromVehicle = (v: Vehicle) => ({
		plate: v.plate,
		color: v.color ?? '',
		model: v.model ?? '',
		brand: v.brand ?? '',
		chassisNumber: v.chassisNumber ?? '',
		additionalInfo: v.additionalInfo ?? '',

		modelYear: v.modelYear,
		fabricationYear: v.fabricationYear
	});

	const sForm = superForm(formSchema, {
		validators: zodClient(updateVehicleSchema),
		onUpdate: ({ form, result }) => {
			if (form.valid) {
				const action = result.data as FormResult<ActionData>;
				if (form.valid && action.updatedVehicle) onVehicleUpdated(action.updatedVehicle);
			}
		},
		onError: showErrorToast
	});
	const { submitting: isLoading } = sForm;

	const brandOptions = carBrands.map((brand) => ({ value: brand, label: brand }));
</script>

<div class="flex mb-4">
	<span class="type-scale-3">Editing vehicle</span>

	<button class="btn-icon ml-auto preset-filled-secondary-200-800" onclick={() => onEditCanceled()}>
		<Icon icon="mdi:pencil-off" />
	</button>
</div>

<!-- TODO: action -->
<form
	class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
	method="POST"
	enctype="multipart/form-data"
	action={route('updateVehicle /client/tracking/vehicles/[vehicle_id=integer]', {
		vehicle_id: vehicle.id.toString()
	})}
	use:sForm.enhance
>
	<MaskedTextField
		form={sForm}
		classes="col-span-1"
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
		name="plate"
		label="Plate *"
	/>

	<TextField
		form={sForm}
		classes="col-span-1"
		name="brand"
		label="Brand *"
		maxlength={30}
		list="brandSuggestions"
	/>
	<datalist id="brandSuggestions">
		{#each brandOptions as brand}
			<option value={brand.value}>{brand.value}</option>
		{/each}
	</datalist>

	<TextField form={sForm} classes="col-span-1" name="model" label="Model *" maxlength={30} />

	<TextField
		form={sForm}
		classes="col-span-1"
		name="chassisNumber"
		label="Chassis Number"
		maxlength={30}
	/>

	<TextField
		form={sForm}
		classes="col-span-1"
		name="fabricationYear"
		label="Fabrication Year"
		type="text"
		maxlength={4}
	/>

	<TextField
		form={sForm}
		classes="col-span-1"
		name="modelYear"
		label="Model Year"
		type="text"
		maxlength={4}
	/>

	<TextField form={sForm} classes="col-span-1" name="color" label="Color" maxlength={12} />

	<TextAreaField
		form={sForm}
		classes="col-span-1 sm:col-span-2 md:col-span-3"
		name="additionalInfo"
		label="Additional Info"
		rows={2}
		maxlength={500}
	/>

	<div class="flex justify-end col-span-1 sm:col-span-3">
		<LoadableButton isLoading={$isLoading} classes="btn preset-filled-primary-200-800">
			update
		</LoadableButton>
	</div>
</form>
