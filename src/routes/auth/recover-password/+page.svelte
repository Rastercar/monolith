<script lang="ts">
	import { apiSignIn } from '$lib/api/auth';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import TextInput from '$lib/components/input/TextInput.svelte';
	import { LightSwitch, getToastStore } from '@skeletonlabs/skeleton';
	import { createMutation } from '@tanstack/svelte-query';
	import { superForm } from 'sveltekit-superforms/client';
	import AuthRedirectLink from '../components/AuthRedirectLink.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const toastStore = getToastStore();

	const recoverForm = superForm(data.form);

	const mutation = createMutation({
		mutationFn: (credentials: any) => apiSignIn(credentials),
		onSuccess: (res) => {
			// TODO:
			// redirect a few frames after svelte updated the auth store
			// setTimeout(redirectAfterLogin, 100);
		},
		onError: () => {
			toastStore.trigger({
				message: 'a unknown error happened',
				background: 'variant-filled-error'
			});
		}
	});

	// TODO: server side validation, responses etc, check email exists (send and deal with EMAIL_NOT_FOUND response
</script>

<!-- TODO: rm me ! -->
<LightSwitch />

<div class="h-full flex justify-center">
	{#if form?.success}
		<!-- TODO: -->
		xd
	{/if}

	<div class="w-96">
		<h1 class="mb-1 text-center text-3xl mt-12">Recover Password</h1>
		<span class="text-sm text-center text-surface-600-300-token">
			Follow the instructions sent to your email address
		</span>

		<form method="post">
			<TextInput
				form={recoverForm}
				field="email"
				label="Your account email"
				placeholder="email address"
				disabled={$mutation.isLoading}
			/>

			<LoadableButton
				class="btn variant-filled-primary mt-4 w-full"
				isLoading={$mutation.isLoading}
			>
				recover password
			</LoadableButton>
		</form>

		<AuthRedirectLink linkLabel="sign-in" href="/auth/sign-in" question="False alert?" />
	</div>
</div>
