<script lang="ts">
	import { updateFleetSchema, type Fleet } from '$lib/api/fleet.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import TextAreaField from '$lib/components/form/TextAreaField.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import { route } from '$lib/ROUTES';
	import { showErrorToast } from '$lib/store/toast';
	import { onMount } from 'svelte';
	import type { FormResult, Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ActionData } from '../../../../routes/client/tracking/fleets/[fleet_id=integer]/$types';

	interface Props {
		fleetId: number;
		initialValues?: Fleet;

		formSchema: SuperValidated<Infer<typeof updateFleetSchema>>;
		extraClasses?: string;
		onUpdate: (_: Fleet) => void;
	}

	let { fleetId, initialValues, formSchema, extraClasses = '', onUpdate }: Props = $props();

	const sForm = superForm(formSchema, {
		validators: zodClient(updateFleetSchema),
		onUpdate: ({ form, result }) => {
			if (form.valid) {
				const action = result.data as FormResult<ActionData>;
				if (form.valid && action.updatedFleet) onUpdate(action.updatedFleet);
			}
		},
		onError: showErrorToast
	});
	const { submitting: isLoading } = sForm;

	onMount(() => {
		if (initialValues) sForm.reset({ data: { ...initialValues } });
	});
</script>

<form
	class={extraClasses}
	method="POST"
	action={route('updateFleet /client/tracking/fleets/[fleet_id=integer]', {
		fleet_id: fleetId.toString()
	})}
	use:sForm.enhance
>
	<TextField form={sForm} name="name" label="Nome *" maxlength={50} />

	<TextAreaField form={sForm} name="description" label="Descrição *" maxlength={500} />

	<div class="mt-6 flex justify-end">
		<LoadableButton isLoading={$isLoading} classes="btn preset-filled-primary-500 ml-auto mt-auto">
			atualizar frota
		</LoadableButton>
	</div>
</form>
