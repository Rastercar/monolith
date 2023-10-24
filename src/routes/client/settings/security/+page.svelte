<script lang="ts">
	import { isApiErrorObject } from '$lib/api/common';
	import {
		apiChangePassword,
		changePasswordBodySchema,
		type ChangePasswordBody
	} from '$lib/api/user';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PasswordInput from '$lib/components/input/PasswordInput.svelte';
	import { genericError } from '$lib/constants/toasts';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createMutation } from '@tanstack/svelte-query';
	import { superForm } from 'sveltekit-superforms/client';
	import { WretchError } from 'wretch/resolver';
	import type { PageData } from './$types';

	export let data: PageData;

	const toastStore = getToastStore();

	const form = superForm(data.form, { validators: changePasswordBodySchema });

	const mutation = createMutation({
		mutationFn: (body: ChangePasswordBody) => apiChangePassword(body),

		onSuccess: () => {
			toastStore.trigger({
				message: 'password changed successfully',
				background: 'variant-filled-success'
			});

			form.reset();
		},

		onError: (err) => {
			if (!(err instanceof WretchError) || !isApiErrorObject(err.json)) {
				return toastStore.trigger(genericError);
			}

			if (err.response.status === 401) {
				form.validate('oldPassword', { value: '', errors: 'invalid password', update: 'errors' });
			}
		}
	});

	const changePassword = async () => {
		const validated = await form.validate();

		if (!validated.valid) {
			form.restore({ ...validated, tainted: undefined });
			return;
		}

		$mutation.mutate(validated.data);
	};
</script>

<div class="p-6 max-w-xl mx-auto">
	<h1 class="text-2xl mb-3">Change Password</h1>

	<PasswordInput {form} field="oldPassword" label="Old Password" placeholder="" />

	<PasswordInput {form} field="newPassword" label="New Password" placeholder="" />

	<PasswordInput
		{form}
		field="newPasswordConfirmation"
		label="Confirm new Password"
		placeholder=""
	/>

	<div class="flex justify-between items-center mt-8">
		<LoadableButton
			class="btn variant-filled-primary"
			isLoading={$mutation.isLoading}
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
</div>
