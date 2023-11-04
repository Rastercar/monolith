<script lang="ts">
	import { apiCreateVehicle } from '$lib/api/vehicle';
	import { createVehicleSchema, type CreateVehicleBody } from '$lib/api/vehicle.schema';
	import ComboBox from '$lib/components/input/ComboBox.svelte';
	import MaskedTextInput from '$lib/components/input/MaskedTextInput.svelte';
	import TextArea from '$lib/components/input/TextArea.svelte';
	import TextInput from '$lib/components/input/TextInput.svelte';
	import Step from '$lib/components/stepper/Step.svelte';
	import type { StepperState } from '$lib/components/stepper/types';
	import { carBrands } from '$lib/constants/data/car-brands';
	import { getToaster } from '$lib/store/toaster';
	import Icon from '@iconify/svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	export let formSchema: SuperValidated<typeof createVehicleSchema>;

	const toaster = getToaster();

	const form = superForm(formSchema, {
		validators: createVehicleSchema,
		validationMethod: 'oninput'
	});

	// AAA9A99 (mercosul format) or AAA9999 (br old format)
	const plateMaskOptions = {
		mask: 'AAA0#00',
		definitions: {
			A: { mask: 'a' },
			0: { mask: '0' },
			'#': { mask: /[0-9A-Za-z]/ }
		}
	};

	const brandOptions = carBrands.map((brand) => ({ value: brand, label: brand }));

	let vehiclePhotos: FileList | null = null;

	let stepperState: Writable<StepperState> = getContext('state');

	const mutation = createMutation({
		mutationFn: (vehicle: { data: CreateVehicleBody; photo?: File }) => {
			return apiCreateVehicle(vehicle.data, vehicle.photo);
		},

		// TODO: on error check if the error was of a type of unique plate error
		// and show the error on the form somehow
		onError: () => toaster.error()
	});

	const createVehicle = async () => {
		const validated = await form.validate();

		if (!validated.valid) return form.restore({ ...validated, tainted: undefined });

		$mutation
			.mutateAsync({ data: validated.data, photo: vehiclePhotos?.item(0) ?? undefined })
			.then(() => $stepperState.current++);
	};

	$: ({ tainted, allErrors } = form);

	$: canSubmit = $tainted === undefined || $allErrors.length > 0;
</script>

<Step>
	<svelte:fragment slot="header">Vehicle Information</svelte:fragment>

	<span class="text-sm">Fields marked as * are required</span>

	<div class="grid grid-cols-2 gap-4">
		<MaskedTextInput
			{form}
			class="label sm:col-span-1 col-span-2 "
			inputClass="input mb-1 uppercase"
			maskOptions={plateMaskOptions}
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

		<label class="label sm:col-span-1 col-span-2">
			<span class="text-sm">Photo</span>
			<input
				class="input"
				type="file"
				bind:files={vehiclePhotos}
				accept="image/png, image/gif, image/jpeg"
			/>
		</label>

		<TextArea
			{form}
			class="label col-span-2"
			field="additionalInfo"
			label="Additional Info"
			rows="6"
			maxlength="500"
		/>
	</div>

	<div class="flex justify-end">
		<button
			class="btn variant-filled"
			disabled={canSubmit || $mutation.isLoading}
			on:click={createVehicle}
		>
			{#if canSubmit}
				<Icon icon="mdi:lock" class="mr-2" />
			{:else if $mutation.isLoading}
				<Icon icon="mdi:loading" class="mr-2 animate-spin" />
			{/if}
			Next &rarr;
		</button>
	</div>
</Step>
