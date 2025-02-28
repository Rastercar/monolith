<script lang="ts">
	import { createFleetSchema, type Fleet } from '$lib/api/fleet.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import TextAreaField from '$lib/components/form/TextAreaField.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import { carBrands } from '$lib/constants/data/car-brands';
	import { route } from '$lib/ROUTES';
	import { showErrorToast } from '$lib/store/toast';
	import type { FormResult, Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ActionData } from '../$types';

	interface Props {
		formSchema: SuperValidated<Infer<typeof createFleetSchema>>;
		onCreate?: (_: Fleet) => void;
	}

	let { formSchema, onCreate }: Props = $props();

	const sForm = superForm(formSchema, {
		validators: zodClient(createFleetSchema),
		onUpdate: ({ form, result }) => {
			if (form.valid) {
				const action = result.data as FormResult<ActionData>;
				if (onCreate && action.createdFleet) onCreate(action.createdFleet);
			}
		},
		onError: showErrorToast
	});

	const brandOptions = carBrands.map((brand) => ({ value: brand, label: brand }));

	const { submitting: isLoading } = sForm;
</script>

<form method="POST" action={route('createFleet /client/tracking/fleets/new')} use:sForm.enhance>
	<TextField form={sForm} name="name" label="Nome *" maxlength={30} />

	<TextAreaField
		form={sForm}
		classes="my-4"
		name="description"
		label="Descrição *"
		rows={3}
		maxlength={500}
	/>

	<div class="flex justify-end">
		<LoadableButton classes="btn preset-filled-primary-200-800" isLoading={$isLoading}>
			cadastrar
		</LoadableButton>
	</div>
</form>
