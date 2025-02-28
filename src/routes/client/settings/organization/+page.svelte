<script lang="ts">
	import { updateOrganizationSchema } from '$lib/api/organization.schema';
	import EmailNotConfirmedWarning from '$lib/components/button/EmailNotConfirmedWarning.svelte';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import { route } from '$lib/ROUTES';
	import { getAuthContext } from '$lib/store/context';
	import { showSuccessToast } from '$lib/store/toast';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SettingsPageTitle from '../components/SettingsPageTitle.svelte';

	let { data } = $props();

	const auth = getAuthContext();

	const sForm = superForm(data.form, {
		resetForm: false,
		validators: zodClient(updateOrganizationSchema),
		onUpdated({ form: { data, valid } }) {
			if (!valid) return;

			auth.updateUserOrg(data);
			showSuccessToast('organização atualizada');
		}
	});

	const { submitting: isLoading } = sForm;
</script>

<SettingsPageTitle>Minha Organização</SettingsPageTitle>

<form
	class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4"
	method="POST"
	action={route('updateOrganization /client/settings/organization')}
	use:sForm.enhance
>
	<TextField
		form={sForm}
		classes="sm:col-span-1 col-span-2"
		name="billingEmail"
		label="Email de cobrança"
	/>

	<TextField
		form={sForm}
		classes="sm:col-span-1 col-span-2"
		maxlength={32}
		name="name"
		label="Nome"
	/>

	{#if auth.user && !auth.user.organization.billingEmailVerified}
		<div class="mt-2 col-span-2">
			<EmailNotConfirmedWarning sendConfirmationEmailTo="organization" />
		</div>
	{/if}

	<div class="col-span-2 flex justify-end">
		<LoadableButton
			classes="btn preset-filled-primary-300-700"
			disabled={$isLoading}
			isLoading={$isLoading}
		>
			atualizar
		</LoadableButton>
	</div>
</form>
