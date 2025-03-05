<script lang="ts">
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import { updateVehicleSchema } from '$lib/api/vehicle.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import MaskedTextField from '$lib/components/form/MaskedTextField.svelte';
	import TextAreaField from '$lib/components/form/TextAreaField.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import SelectFleetInput from '$lib/components/non-generic/input/SelectFleetInput.svelte';
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
		onEditCanceled: VoidFunction;
		onVehicleUpdated: (_: Vehicle) => void;
	}

	let { vehicle, formSchema, onEditCanceled, onVehicleUpdated }: Props = $props();

	let selectFleetSearchValue = $state(vehicle.fleet?.name ?? '');

	const sForm = superForm(formSchema, {
		dataType: 'json',
		validators: zodClient(updateVehicleSchema),
		onUpdate: ({ form, result }) => {
			if (form.valid) {
				const action = result.data as FormResult<ActionData>;
				if (form.valid && action.updatedVehicle) onVehicleUpdated(action.updatedVehicle);
			}
		},
		onError: showErrorToast
	});
	const { submitting: isLoading, form } = sForm;

	const brandOptions = carBrands.map((brand) => ({ value: brand, label: brand }));
</script>

<div class="flex mb-4">
	<span class="text-lg">Editando veículo</span>

	<button class="btn-icon ml-auto preset-filled-secondary-200-800" onclick={() => onEditCanceled()}>
		<Icon icon="mdi:pencil-off" />
	</button>
</div>

<form
	class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
	method="POST"
	enctype="multipart/form-data"
	action={route('updateVehicle /client/rastreamento/veiculos/[vehicle_id=integer]', {
		vehicle_id: vehicle.id.toString()
	})}
	use:sForm.enhance
>
	<div>
		<span class="mb-1 block">Frota</span>
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
		label="Placa *"
	/>

	<TextField
		form={sForm}
		classes="col-span-1"
		name="brand"
		label="Marca *"
		maxlength={30}
		list="brandSuggestions"
	/>
	<datalist id="brandSuggestions">
		{#each brandOptions as brand}
			<option value={brand.value}>{brand.value}</option>
		{/each}
	</datalist>

	<TextField form={sForm} classes="col-span-1" name="model" label="Modelo *" maxlength={30} />

	<TextField form={sForm} classes="col-span-1" name="chassisNumber" label="Chassi" maxlength={30} />

	<TextField
		form={sForm}
		classes="col-span-1"
		name="fabricationYear"
		label="Ano Fabricação"
		type="text"
		maxlength={4}
	/>

	<TextField
		form={sForm}
		classes="col-span-1"
		name="modelYear"
		label="Ano Modelo"
		type="text"
		maxlength={4}
	/>

	<TextField form={sForm} classes="col-span-1" name="color" label="Color" maxlength={12} />

	<TextAreaField
		form={sForm}
		classes="col-span-1 sm:col-span-2 md:col-span-3"
		name="additionalInfo"
		label="Informação adicional"
		rows={2}
		maxlength={500}
	/>

	<div class="flex justify-end col-span-1 sm:col-span-3">
		<LoadableButton isLoading={$isLoading} classes="btn preset-filled-primary-200-800">
			atualizar
		</LoadableButton>
	</div>
</form>
