<script lang="ts">
	import { updateUserSchema } from '$lib/api/user.schema';
	import EmailNotConfirmedWarning from '$lib/components/button/EmailNotConfirmedWarning.svelte';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import TextAreaField from '$lib/components/form/TextAreaField.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import { route } from '$lib/ROUTES.js';
	import { getAuthContext } from '$lib/store/auth.svelte';
	import { showSuccessToast } from '$lib/toast.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	const auth = getAuthContext();

	const form = superForm(data.form, {
		validators: zodClient(updateUserSchema),
		onUpdated({ form: { data, valid } }) {
			if (valid) auth.updateUser(data);

			// superforms keeps the old defaults of the forms (the previous user values)
			// so we need to update the form ourselves on the clientside after a sucessfull submit
			form.form.set(data);

			showSuccessToast('profile updated');
		}
	});
	const { submitting: isLoading } = form;
</script>

{#if auth.user}
	<h1 class="h1 mb-3">My Profile</h1>

	<!-- TODO: -->
	<!-- <ProfilePictureDropzone /> -->

	<form
		class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4"
		method="POST"
		action={route('updateProfile /client/settings/profile')}
		use:form.enhance
	>
		<TextField {form} name="email" label="Email" />

		<TextField {form} maxlength={32} name="username" label="Username" />

		{#if !auth.user.emailVerified}
			<EmailNotConfirmedWarning
				extraClasses="col-span-1 md:col-span-2 mb-4"
				sendConfirmationEmailTo="user"
			/>
		{/if}

		<TextAreaField
			{form}
			name="description"
			label="Description"
			classes="col-span-1 md:col-span-2"
			rows={6}
		/>

		<div class="grid-cols-1 md:col-span-2 flex justify-end">
			<LoadableButton
				classes="btn preset-filled-primary-300-700"
				disabled={$isLoading}
				isLoading={$isLoading}
			>
				update
			</LoadableButton>
		</div>
	</form>
{/if}
