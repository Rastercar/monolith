<script lang="ts">
	import { createVehicleSchema, type Vehicle } from '$lib/api/vehicle.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import ComboBoxField from '$lib/components/form/ComboBoxField.svelte';
	import TextAreaField from '$lib/components/form/TextAreaField.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import { carBrands } from '$lib/constants/data/car-brands';
	import { route } from '$lib/ROUTES';
	import { showErrorToast } from '$lib/store/toast';
	import type { FormResult, Infer, SuperValidated } from 'sveltekit-superforms';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ActionData } from '../$types';

	interface Props {
		formSchema: SuperValidated<Infer<typeof createVehicleSchema>>;
		onCreate?: (_: Vehicle) => void;
	}

	let { formSchema, onCreate }: Props = $props();

	const sForm = superForm(formSchema, {
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

	const { form } = $derived(sForm);

	// 	// TODO: nuke this function from orbit
	// const createVehicle = async () => {
	// 	const validated = await sForm.validateForm();

	// 	if (!validated.valid) return sForm.restore({ ...validated, tainted: undefined });

	// 	clearFileInputsUnderFormWithId('formId');
	// 	sForm.reset();
	// };
</script>

<SuperDebug data={form} />

<!-- TODO: change route to create vehicle -->
<form
	class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
	method="POST"
	action={route('createSimCard /client/tracking/sim-cards/new')}
	use:sForm.enhance
>
	<!-- <MaskedTextInput
		{form}
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
	/> -->

	<ComboBoxField
		form={sForm}
		classes="col-span-1"
		options={brandOptions}
		name="brand"
		label="Brand *"
	/>

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

	<!-- <FileInput
		{form}
		classes="col-span-1"
		label="Photo"
		name="photoName"
		fileField="photo"
		accept="image/png, image/gif, image/jpeg, image/webp"
		on:file-selected={({ detail: file }) => {
			form.validate('photo', { value: file, update: 'errors', taint: true });
		}}
	/> -->

	<TextAreaField
		form={sForm}
		classes="col-span-1 sm:col-span-2 md:col-span-3"
		name="additionalInfo"
		label="Additional Info"
		rows={3}
		maxlength={500}
	/>

	<div class="col-span-1 sm:col-span-2 md:col-span-3 flex justify-end">
		<LoadableButton classes="btn preset-filled-primary-200-800" isLoading={false}>
			<!-- TODO: -->
			<!-- 		onclick={createVehicle}
			isLoading={$mutation.isPending} -->
			create
		</LoadableButton>
	</div>
</form>
