<script lang="ts">
	import { signUpSchema } from '$lib/api/auth.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PasswordField from '$lib/components/form/PasswordField.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import { route } from '$lib/ROUTES';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import AuthPagesLayout from '../components/AuthPagesLayout.svelte';
	import AuthRedirectLink from '../components/AuthRedirectLink.svelte';

	let { data } = $props();

	const sForm = superForm(data.form, { validators: zodClient(signUpSchema) });
	const { submitting: isLoading } = sForm;
</script>

<AuthPagesLayout title="Cadastre-se" subtitle="Tenha sua própria plataforma de rastreamento!">
	<form method="POST" action={route('signUp /auth/cadastro')} use:sForm.enhance class="space-y-4">
		<TextField
			form={sForm}
			name="email"
			label="Email"
			labelExtraClasses="mt-4"
			disabled={$isLoading}
		/>

		<TextField form={sForm} name="username" label="Nome de Usuário" disabled={$isLoading} />

		<PasswordField form={sForm} name="password" label="Senha" disabled={$isLoading} />

		<PasswordField
			form={sForm}
			name="passwordConfirmation"
			label="Confime sua senha"
			disabled={$isLoading}
		/>

		<LoadableButton
			classes="btn preset-filled-primary-200-800 w-full"
			disabled={$isLoading}
			isLoading={$isLoading}
		>
			cadastrar
		</LoadableButton>
	</form>

	<AuthRedirectLink linkLabel="login" href={route('/auth/login')} question="Já tem uma conta?" />
</AuthPagesLayout>
