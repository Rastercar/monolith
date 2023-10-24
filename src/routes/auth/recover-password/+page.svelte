<script lang="ts">
	import ErrorMessage from '$lib/components/input/ErrorMessage.svelte';
	import TextInput from '$lib/components/input/TextInput.svelte';
	import { authStore } from '$lib/store/auth';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import AuthRedirectLink from '../components/AuthRedirectLink.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const recoverForm = superForm(data.form);

	const success = form?.error === null;

	const title = success ? 'Success !' : 'Recover Password';

	const subtitle = success
		? 'Follow the instructions sent to your email address'
		: 'Inform your account email address to receive password recovery instructions';

	onMount(() => {
		// If the user is logged in, the email the account he wants to
		// recover is most certainly the one he is currently logged as
		if (user) recoverForm.form.set({ email: user.email });
	});

	$: ({ user } = $authStore);
</script>

<div class="h-full flex justify-center px-6">
	<div class="w-96">
		<h1 class="mb-1 text-center text-3xl mt-12">{title}</h1>
		<p class="text-sm text-center text-surface-600-300-token mb-4">
			{subtitle}
		</p>

		{#if success}
			<a href="/" class="btn variant-filled mt-4 w-full">back to home</a>
		{:else}
			<form method="post">
				<TextInput
					form={recoverForm}
					field="email"
					label="Your account email"
					placeholder="email address"
				/>
				{#if form?.error === 'not_found'}
					<ErrorMessage errors={['user not found with this email']} />
				{/if}

				<button class="btn variant-filled-primary mt-4 w-full"> recover password </button>
			</form>

			{#if user}
				<AuthRedirectLink linkLabel="go to home page" href="/client" question="False alert?" />
			{:else}
				<AuthRedirectLink linkLabel="sign-in" href="/auth/sign-in" question="False alert?" />
			{/if}
		{/if}
	</div>
</div>
