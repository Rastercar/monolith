<script lang="ts">
	import { apiChangePassword } from '$lib/api/user';
	import { changePasswordSchema, type ChangePasswordBody } from '$lib/api/user.schema';
	import { isAppError } from '$lib/api/utils';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PasswordInput from '$lib/components/form/PasswordInput.svelte';
	import { getToaster } from '$lib/store/toaster';
	import { createMutation } from '@tanstack/svelte-query';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { WretchError } from 'wretch/resolver';

	let { data } = $props();

	const toaster = getToaster();

	const form = superForm(data.form, { validators: zodClient(changePasswordSchema) });

	const mutation = createMutation({
		mutationFn: (body: ChangePasswordBody) => apiChangePassword(body),

		onSuccess: () => {
			toaster.success('password changed successfully');
			form.reset();
		},

		onError: (err) => {
			if (!(err instanceof WretchError) || !isAppError(err.json)) {
				return toaster.error();
			}

			if (err.response.status === 401) {
				form.validate('oldPassword', { value: '', errors: 'invalid password', update: 'errors' });
			}
		}
	});

	const changePassword = async () => {
		const validated = await form.validateForm();

		if (!validated.valid) {
			form.restore({ ...validated, tainted: undefined });
			return;
		}

		$mutation.mutate(validated.data);
	};
</script>

<h1 class="text-2xl mb-3">Change Password</h1>

<PasswordInput {form} field="oldPassword" label="Old Password" placeholder="" />

<PasswordInput {form} field="newPassword" label="New Password" placeholder="" />

<PasswordInput {form} field="newPasswordConfirmation" label="Confirm new Password" placeholder="" />

<div class="flex justify-between items-center mt-8">
	<LoadableButton
		class="btn variant-filled-primary"
		isLoading={$mutation.isPending}
		on:click={changePassword}
	>
		change password
	</LoadableButton>

	<a
		href="/auth/recover-password"
		class="text-sm text-primary-700-200-token underline-offset-4 hover:underline"
	>
		forgot your password?
	</a>
</div>
