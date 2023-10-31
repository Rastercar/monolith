<script lang="ts">
	import { createVehicleSchema } from '$lib/api/vehicle.schema';
	import TextArea from '$lib/components/input/TextArea.svelte';
	import TextInput from '$lib/components/input/TextInput.svelte';
	import { imask } from '@imask/svelte';
	import { Step, Stepper } from '@skeletonlabs/skeleton';
	import { InputMask, type FactoryArg } from 'imask';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: createVehicleSchema,
		validationMethod: 'oninput'
	});

	// TODO: check if i need imask dependency and check if https://github.com/PaulMaly/svelte-imask/blob/master/src/action.js is enough

	// TODO: properly type me !
	// AAA9A99 or AAA9999
	const options: FactoryArg = {
		mask: 'aaa0#000',
		lazy: false,
		definitions: {
			'#': /[0-9A-Za-z]/
		}
	};

	let value = '';

	function accept(xd: CustomEvent<InputMask<typeof options>>) {
		const { detail } = xd;
		console.log('!', xd.detail instanceof InputMask);

		console.log('accept', detail.value);
		value = detail.value;
	}

	function complete({ detail }: CustomEvent<InputMask<typeof options>>) {
		console.log('complete', detail.unmaskedValue);
	}
</script>

<!-- TODO: -->
<div class="p-6 max-w-3xl mx-auto">
	<Stepper>
		<!-- TODO: form is valid -->
		<Step locked={true}>
			<svelte:fragment slot="header">Vehicle Information</svelte:fragment>

			<span class="text-sm">Fields marked as * are required</span>

			{value}

			<!-- TODO: fix me and probably component me ! -->
			<input
				class="input uppercase"
				{value}
				use:imask={options}
				on:accept={accept}
				on:complete={complete}
			/>

			<div class="grid grid-cols-2 gap-4">
				<TextInput {form} class="label sm:col-span-1 col-span-2" field="plate" label="Plate *" />

				<TextInput {form} class="label sm:col-span-1 col-span-2" field="brand" label="Brand *" />

				<TextInput {form} class="label sm:col-span-1 col-span-2" field="model" label="Model *" />

				<TextInput
					{form}
					class="label sm:col-span-1 col-span-2"
					field="chassisNumber"
					label="Chassis Number"
				/>

				<TextInput
					{form}
					class="label sm:col-span-1 col-span-2"
					maxlength="32"
					field="modelYear"
					label="Model Year"
				/>

				<TextInput
					{form}
					class="label sm:col-span-1 col-span-2"
					field="fabricationYear"
					label="Fabrication Year"
				/>

				<TextInput {form} class="label sm:col-span-1 col-span-2" field="color" label="Color" />

				<TextArea
					{form}
					class="label col-span-2"
					field="additionalInfo"
					label="Additional Info"
					rows="6"
				/>
			</div>
		</Step>
		<Step>
			<svelte:fragment slot="header">(header)</svelte:fragment>
			(content)
		</Step>
	</Stepper>
</div>
