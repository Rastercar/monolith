<script lang="ts">
	import { goto } from '$app/navigation';
	import { apiRecoverPasswordByToken } from '$lib/api/auth';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import { genericError } from '$lib/constants/toasts';
	import Icon from '@iconify/svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createMutation } from '@tanstack/svelte-query';
	import { WretchError } from 'wretch/resolver';
	import AuthRedirectLink from '../components/AuthRedirectLink.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	// TODO: this page is copy pasted, finish me !

	const toastStore = getToastStore();

	let errorStatusCode: null | number = null;

	const mutation = createMutation({
		mutationFn: (newPassword: string) =>
			apiRecoverPasswordByToken({ newPassword, confirmEmailToken: data.confirmEmailToken } as any),
		onSuccess: () => {
			// show success message with
			redirecting = true;
			goto('/client').finally(() => (redirecting = false));
		},
		onError: (err) => {
			if (err instanceof WretchError) {
				errorStatusCode = err.response.status;
			} else {
				toastStore.trigger(genericError);
			}
		}
	});

	const changePassword = async () => {
		$mutation.mutate('');
	};

	let redirecting = false;

	$: isLoading = redirecting || $mutation.isLoading;
</script>

<div class="h-full flex justify-center">
	<div class="w-96">
		<h1 class="mb-1 text-center text-3xl mt-12">Change Password</h1>

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
	</div>
</div>
