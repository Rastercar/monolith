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

	const form = superForm(data.form, { validators: zodClient(signUpSchema) });
	const { submitting: isLoading } = form;
</script>

<AuthPagesLayout title="Sign Up." subtitle="Join best car tracking app in seconds!">
	<form method="POST" action={route('signUp /auth/sign-up')} use:form.enhance class="space-y-4">
		<TextField {form} name="email" label="Email" labelExtraClasses="mt-4" disabled={$isLoading} />

		<TextField {form} name="username" label="Username" disabled={$isLoading} />

		<PasswordField {form} name="password" label="Password" disabled={$isLoading} />

		<PasswordField
			{form}
			name="passwordConfirmation"
			label="Confirm Password"
			disabled={$isLoading}
		/>

		<LoadableButton
			classes="btn preset-filled-primary-200-800 w-full"
			disabled={$isLoading}
			isLoading={$isLoading}
		>
			sign up
		</LoadableButton>
	</form>

	<AuthRedirectLink
		linkLabel="sign-in"
		href={route('/auth/sign-in')}
		question="Already have an account?"
	/>
</AuthPagesLayout>
