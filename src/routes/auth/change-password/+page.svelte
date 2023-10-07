<script lang="ts">
	import { goto } from '$app/navigation';
	import { apiRecoverPasswordByToken } from '$lib/api/auth';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PasswordInput from '$lib/components/input/PasswordInput.svelte';
	import { genericError } from '$lib/constants/toasts';
	import { passwordValidator } from '$lib/utils/zod-validators';
	import Icon from '@iconify/svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createMutation } from '@tanstack/svelte-query';
	import { superForm } from 'sveltekit-superforms/client';
	import { WretchError } from 'wretch/resolver';
	import { z } from 'zod';
	import AuthRedirectLink from '../components/AuthRedirectLink.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const toastStore = getToastStore();

	const validators = z
		.object({
			newPassword: passwordValidator,
			passwordConfirmation: z.string().min(5)
		})
		.refine((data) => data.newPassword === data.passwordConfirmation, {
			message: "Passwords didn't match",
			path: ['passwordConfirmation']
		});

	const form = superForm(data.form, { validators });

	let errorStatusCode: null | number = null;

	const redirectToHomePage = () => {
		redirecting = true;
		goto('/client').finally(() => (redirecting = false));
	};

	const mutation = createMutation({
		mutationFn: (newPassword: string) =>
			apiRecoverPasswordByToken({ newPassword, passwordResetToken: data.passwordRecoveryToken }),
		onError: (err) => {
			if (err instanceof WretchError) {
				errorStatusCode = err.response.status;
			} else {
				toastStore.trigger(genericError);
			}
		}
	});

	const changePassword = async () => {
		const validated = await form.validate();

		if (!validated.valid) {
			return form.restore({ ...validated, tainted: undefined });
		}

		$mutation.mutate(validated.data.newPassword);
	};

	let redirecting = false;

	$: isLoading = redirecting || $mutation.isLoading;
</script>

<div class="h-full flex justify-center">
	<div class="w-96">
		{#if $mutation.isSuccess}
			<div class="flex flex-col">
				<h1 class="mb-1 text-3xl mt-12 flex text-center">password changed successfully !</h1>
				<button class="btn variant-filled-primary mt-4 mx-auto" on:click={redirectToHomePage}>
					go to home page
				</button>
			</div>
		{:else}
			<h1 class="mb-1 text-center text-3xl mt-12">Change Password</h1>

			<PasswordInput
				{form}
				placeholder="New Password"
				field="newPassword"
				disabled={isLoading || errorStatusCode !== null}
			/>

			<PasswordInput
				{form}
				label="Confirm new password"
				placeholder="Confirm new password"
				field="passwordConfirmation"
				disabled={isLoading || errorStatusCode !== null}
			/>

			{#if errorStatusCode === null}
				<LoadableButton
					{isLoading}
					class="btn variant-filled-primary mt-4 w-full"
					on:click={changePassword}
				>
					change password
				</LoadableButton>

				<AuthRedirectLink linkLabel="go back" href="/client" question="False alert?" />
			{:else}
				<aside class="alert variant-filled-error mt-4 mb-2">
					<Icon icon="mdi:alert" width="32" height="32" />

					<p class="alert-message">
						{errorStatusCode === 401 || errorStatusCode === 404
							? 'Your password reset token is invalid'
							: 'A unknown error happened'}
					</p>
				</aside>

				<span class="text-sm">
					Please click
					<a
						href="/auth/recover-password"
						class="text-primary-700-200-token underline-offset-4 hover:underline"
					>
						follow this link
					</a>
					to recover your password
				</span>
			{/if}
		{/if}
	</div>
</div>
