<script lang="ts">
	import { recoverPasswordSchema } from '$lib/api/auth.schema';
	import TextField from '$lib/components/form/v2/TextField.svelte';
	import { route } from '$lib/ROUTES';
	import { authStore } from '$lib/store/auth.svelte';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import AuthRedirectLink from '../components/AuthRedirectLink.svelte';

	let { data } = $props();

	const form = superForm(data.form, { validators: zodClient(recoverPasswordSchema) });
	const { delayed: isLoading } = form;

	const { message } = form;

	const success = $message && $message.type === 'success';
	const title = success ? 'Success !' : 'Recover Password';

	const subtitle = success
		? 'Follow the instructions sent to your email address'
		: 'Inform your account email address to receive password recovery instructions';

	const { user } = authStore.getValue();

	onMount(() => {
		// If the user is logged in, the email the account he wants to
		// recover is most certainly the one he is currently logged as
		if (user) form.form.set({ email: user.email });
	});
</script>

<div class="h-full flex justify-center px-6">
	<div class="max-w-xl">
		<h1 class="mb-1 text-center h1 mt-12">{title}</h1>
		<p class="type-scale-3 text-center text-surface-700-300 mb-8">
			{subtitle}
		</p>

		{#if success}
			<a href="/" class="btn preset-filled-primary-200-800 mt-4 w-full">back to home</a>
		{:else}
			<form method="post" action={route('recoverPassword /auth/recover-password')} use:form.enhance>
				<TextField {form} name="email" label="Your account email" placeholder="email address" />
				<button class="btn preset-filled-primary-200-800 mt-4 w-full"> recover password </button>
			</form>

			{#if user}
				<AuthRedirectLink linkLabel="go to home page" href="/client" question="False alert?" />
			{:else}
				<AuthRedirectLink linkLabel="sign-in" href="/auth/sign-in" question="False alert?" />
			{/if}
		{/if}
	</div>
</div>
