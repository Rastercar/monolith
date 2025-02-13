<script lang="ts">
	import { changePasswordSchema } from '$lib/api/user.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PasswordField from '$lib/components/form/PasswordField.svelte';
	import { route } from '$lib/ROUTES';
	import { showErrorToast, showSuccessToast } from '$lib/store/toast';
	import Icon from '@iconify/svelte';
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

{#if data.redirectHereDueToForcePasswordChange}
	<div class="card preset-outlined-warning-200-800 p-4 mb-6">
		<div class="flex items-center">
			<Icon icon="mdi:lock" height={24} class="mr-2" />
			<h2>You <span class="font-bold">must</span> change your password</h2>
		</div>

		<p class="type-scale-2 mt-4">
			For security reasons your organization owner requires new users to change their passwords
			before being able to use the rastercar platform.
		</p>
	</div>
{/if}

<form method="POST" action={route('changePassword /client/settings/security')} use:sForm.enhance>
	<div class="space-y-4">
		<PasswordField form={sForm} name="oldPassword" label="Old Password" />

		<PasswordField form={sForm} name="newPassword" label="New Password" />

		<PasswordField form={sForm} name="newPasswordConfirmation" label="Confirm new Password" />
	</div>

	<div class="flex items-center mt-8">
		{#if !data.redirectHereDueToForcePasswordChange}
			<a
				href={route('/auth/recover-password')}
				class="text-sm text-primary-800-200 underline-offset-4 hover:underline"
			>
				forgot your password?
			</a>
		{/if}

		<LoadableButton classes="btn preset-filled-primary-400-600 ml-auto" isLoading={$isLoading}>
			change password
		</LoadableButton>
	</div>
</form>
