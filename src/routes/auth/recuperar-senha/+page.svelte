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
				? 'Siga as instruções enviadas ao seu email'
				: 'Informe o email de sua conta para receber as instruções de recuperação de senha'}
		</p>

		{#if success}
			<a href="/" class="btn preset-filled-primary-200-800 mt-4 w-full">voltar a página principal</a
			>
		{:else}
			<form method="post" action={route('recoverPassword /auth/recuperar-senha')} use:sForm.enhance>
				<TextField
					form={sForm}
					name="email"
					label="Email da sua conta"
					placeholder="email address"
				/>

				<LoadableButton
					isLoading={$submitting}
					classes="btn preset-filled-primary-200-800 mt-4 w-full"
				>
					recuperar senha
				</LoadableButton>
			</form>

			{#if data.user}
				<AuthRedirectLink
					linkLabel="voltar a página principal"
					href={route('/client')}
					question="Alerta falso?"
				/>
			{:else}
				<AuthRedirectLink linkLabel="login" href={route('/auth/login')} question="Alerta falso?" />
			{/if}
		{/if}
	</div>
</div>
