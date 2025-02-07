<script lang="ts">
	import { recoverPasswordSchema } from '$lib/api/auth.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import { route } from '$lib/ROUTES';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import AuthRedirectLink from '../components/AuthRedirectLink.svelte';

	let { data } = $props();

	const sForm = superForm(data.form, { validators: zodClient(recoverPasswordSchema) });
	const { message, submitting } = sForm;

	const success = $derived(!!$message && $message.type === 'success');

	onMount(() => {
		// If the user is logged in, the email the account he wants to
		// recover is most certainly the one he is currently logged as
		if (data.user) sForm.form.set({ email: data.user.email });
	});
</script>

<div class="h-full flex justify-center px-6">
	<div class="max-w-xl">
		<h1 class="mb-1 text-center h1 mt-12">{success ? 'Success !' : 'Recover Password'}</h1>
		<p class="type-scale-3 text-center text-surface-700-300 mb-8">
			{success
				? 'Follow the instructions sent to your email address'
				: 'Inform your account email address to receive password recovery instructions'}
		</p>

		{#if success}
			<a href="/" class="btn preset-filled-primary-200-800 mt-4 w-full">back to home</a>
		{:else}
			<form
				method="post"
				action={route('recoverPassword /auth/recover-password')}
				use:sForm.enhance
			>
				<TextField
					form={sForm}
					name="email"
					label="Your account email"
					placeholder="email address"
				/>

				<LoadableButton
					isLoading={$submitting}
					classes="btn preset-filled-primary-200-800 mt-4 w-full"
				>
					recover password
				</LoadableButton>
			</form>

			{#if data.user}
				<AuthRedirectLink
					linkLabel="go to home page"
					href={route('/client/my-profile')}
					question="False alert?"
				/>
			{:else}
				<AuthRedirectLink
					linkLabel="sign-in"
					href={route('/auth/sign-in')}
					question="False alert?"
				/>
			{/if}
		{/if}
	</div>
</div>
