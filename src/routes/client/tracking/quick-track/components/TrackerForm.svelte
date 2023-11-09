<script lang="ts">
	import { createTrackerSchema } from '$lib/api/tracker.schema';
	import { apiCreateVehicle } from '$lib/api/vehicle';
	import type { CreateVehicleBody } from '$lib/api/vehicle.schema';
	import TextInput from '$lib/components/input/TextInput.svelte';
	import type { StepperState } from '$lib/components/stepper/types';
	import { carBrands } from '$lib/constants/data/car-brands';
	import { getToaster } from '$lib/store/toaster';
	import Icon from '@iconify/svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	export let formSchema: SuperValidated<typeof createTrackerSchema>;

	const toaster = getToaster();

	const form = superForm(formSchema, {
		validators: createTrackerSchema,
		validationMethod: 'oninput'
	});

	const brandOptions = carBrands.map((brand) => ({ value: brand, label: brand }));

	let stepperState: Writable<StepperState> = getContext('state');

	const mutation = createMutation({
		mutationFn: (b: CreateVehicleBody) => apiCreateVehicle(b)
	});

	const createVehicle = async () => {
		const validated = await form.validate();

		if (!validated.valid) return form.restore({ ...validated, tainted: undefined });

		const body: Partial<CreateVehicleBody> = {};

		Object.entries(validated.data).forEach(([k, v]) => {
			if (v) body[k as keyof CreateVehicleBody] = v;
		});

		// shitty hack, when sending formData with objects with undefined values (eg: {a: undefined})
		// its sent as with the value set to 'undefined' string, what we really want is to exclude
		// fields where the value is undefined or a empty string
		$mutation.mutateAsync(body as CreateVehicleBody).then((createdVehicle) => {
			// TODO: set created vehicle ?
			$stepperState.current++;
		});
	};

	$: ({ tainted, allErrors, validate } = form);

	$: canSubmit = $tainted === undefined || $allErrors.length > 0;
</script>

<div class="grid grid-cols-2 gap-4 mb-4">
	<TextInput
		{form}
		class="label sm:col-span-1 col-span-2"
		field="imei"
		label="IMEI *"
		maxlength="50"
	/>

	<!-- TODO: select input -->
	<TextInput {form} class="label sm:col-span-1 col-span-2" field="model" label="Model" />
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

		Next <Icon icon="mdi:arrow-right" class="ml-2" />
	</button>
</div>
