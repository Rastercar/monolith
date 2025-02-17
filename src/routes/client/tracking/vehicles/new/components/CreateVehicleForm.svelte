<script lang="ts">
	import type { Fleet } from '$lib/api/fleet.schema';
	import { createVehicleSchema, type Vehicle } from '$lib/api/vehicle.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import FileInputField from '$lib/components/form/FileInputField.svelte';
	import MaskedTextField from '$lib/components/form/MaskedTextField.svelte';
	import TextAreaField from '$lib/components/form/TextAreaField.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import SelectFleetInput from '$lib/components/non-generic/input/SelectFleetInput.svelte';
	import { carBrands } from '$lib/constants/data/car-brands';
	import { route } from '$lib/ROUTES';
	import { showErrorToast } from '$lib/store/toast';
	import type { FormResult, Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ActionData } from '../$types';

	interface Props {
		formSchema: SuperValidated<Infer<typeof createVehicleSchema>>;
		onCreate?: (_: Vehicle) => void;
	}

	let { formSchema, onCreate }: Props = $props();

	let selectedFleet: null | Fleet = $state(null);
	let selectFleetSearchValue = $state('');

	const sForm = superForm(formSchema, {
		dataType: 'json',
		validators: zodClient(createVehicleSchema),
		onUpdate: ({ form, result }) => {
			if (form.valid) {
				const action = result.data as FormResult<ActionData>;
				if (onCreate && action.createdVehicle) onCreate(action.createdVehicle);
			}
		},
		onError: showErrorToast
	});

	const brandOptions = carBrands.map((brand) => ({ value: brand, label: brand }));

	const { submitting: isLoading, form } = sForm;
</script>

<form
	class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
	method="POST"
	enctype="multipart/form-data"
	action={route('createVehicle /client/tracking/vehicles/new')}
	use:sForm.enhance
>
	<div>
		<span class="mb-1 block">Fleet</span>
		<SelectFleetInput
			bind:searchValue={selectFleetSearchValue}
			value={$form.fleetId?.toString() ?? ''}
			onItemSelected={(e) => ($form.fleetId = e?.id ?? null)}
		/>
	</div>

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
		name="modelYear"
		label="Model Year"
		type="text"
		maxlength={4}
	/>

	<TextField
		form={sForm}
		classes="col-span-1"
		name="fabricationYear"
		label="Fabrication Year"
		type="text"
		maxlength={4}
	/>

	<TextField form={sForm} classes="col-span-1" name="color" label="Color" maxlength={12} />

	<FileInputField
		form={sForm}
		classes="col-span-1 sm:col-span-2 md:col-span-3"
		name="photo"
		label="Photo"
		accept="image/png, image/jpeg, image/webp"
	/>

	<TextAreaField
		form={sForm}
		classes="col-span-1 sm:col-span-2 md:col-span-3"
		name="additionalInfo"
		label="Additional Info"
		rows={3}
		maxlength={500}
	/>

	<div class="col-span-1 sm:col-span-2 md:col-span-3 flex justify-end">
		<LoadableButton classes="btn preset-filled-primary-200-800" isLoading={$isLoading}>
			create
		</LoadableButton>
	</div>
</form>
