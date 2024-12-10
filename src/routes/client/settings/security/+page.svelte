<script lang="ts">
	import { changePasswordSchema } from '$lib/api/user.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PasswordField from '$lib/components/form/PasswordField.svelte';
	import { route } from '$lib/ROUTES';
	import { showErrorToast, showSuccessToast } from '$lib/store/toast.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SettingsPageTitle from '../components/SettingsPageTitle.svelte';

	let { data } = $props();

	const sForm = superForm(data.form, {
		validators: zodClient(changePasswordSchema),
		onUpdated({ form: { valid } }) {
			if (!valid) return;
			showSuccessToast('password updated');
		},
		onError: showErrorToast
	});
	const { submitting: isLoading } = sForm;
</script>

<SettingsPageTitle>Change Password</SettingsPageTitle>

<form method="POST" action={route('changePassword /client/settings/security')} use:sForm.enhance>
	<div class="space-y-4">
		<PasswordField form={sForm} name="oldPassword" label="Old Password" />

		<PasswordField form={sForm} name="newPassword" label="New Password" />

		<PasswordField form={sForm} name="newPasswordConfirmation" label="Confirm new Password" />
	</div>

	<div class="flex justify-between items-center mt-8">
		<a
			href={route('/auth/recover-password')}
			class="text-sm text-primary-800-200 underline-offset-4 hover:underline"
		>
			forgot your password?
		</a>

		<LoadableButton classes="btn preset-filled-primary-400-600" isLoading={$isLoading}>
			change password
		</LoadableButton>
	</div>
</form>
