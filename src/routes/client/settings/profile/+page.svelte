<script lang="ts">
	import { updateUserSchema } from '$lib/api/user.schema';
	import EmailNotConfirmedWarning from '$lib/components/button/EmailNotConfirmedWarning.svelte';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import TextAreaField from '$lib/components/form/TextAreaField.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import { route } from '$lib/ROUTES.js';
	import { getAuthContext } from '$lib/store/context';
	import { showSuccessToast } from '$lib/store/toast.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SettingsPageTitle from '../components/SettingsPageTitle.svelte';
	import ProfilePictureDropzone from './components/ProfilePictureDropzone.svelte';

	let { data } = $props();

	const auth = getAuthContext();

	const sForm = superForm(data.form, {
		resetForm: false,
		validators: zodClient(updateUserSchema),
		onUpdated({ form: { data, valid } }) {
			if (!valid) return;

			auth.updateUser(data);
			showSuccessToast('profile updated');
		}
	});
	const { submitting: isLoading } = sForm;
</script>

{#if auth.user}
	<SettingsPageTitle>My Profile</SettingsPageTitle>

	<ProfilePictureDropzone />

	<form
		class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4"
		method="POST"
		action={route('updateProfile /client/settings/profile')}
		use:sForm.enhance
	>
		<TextField form={sForm} name="email" label="Email" />

		<TextField form={sForm} maxlength={32} name="username" label="Username" />

		{#if !auth.user.emailVerified}
			<EmailNotConfirmedWarning
				extraClasses="col-span-1 md:col-span-2 mb-4"
				sendConfirmationEmailTo="user"
			/>
		{/if}

		<TextAreaField
			form={sForm}
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
