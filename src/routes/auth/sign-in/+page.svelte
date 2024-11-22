<script lang="ts">
	import { signInSchema } from '$lib/api/auth.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PasswordField from '$lib/components/form/v2/PasswordField.svelte';
	import TextField from '$lib/components/form/v2/TextField.svelte';
	import { route } from '$lib/ROUTES';
	import { authStore } from '$lib/store/auth';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import AuthPagesLayout from '../components/AuthPagesLayout.svelte';
	import AuthRedirectLink from '../components/AuthRedirectLink.svelte';

	const { data } = $props();

	const form = superForm(data.form, { validators: zodClient(signInSchema) });

	const { delayed: isLoading } = form;

	// clear the user whenever loading this page, since if this page could only be loaded
	// if there is no current user session so any user on the auth store is outdated
	onMount(() => authStore.clearUser());
</script>

<AuthPagesLayout title="Welcome back." subtitle="Sign in to the best car tracking app!">
	<form method="POST" action={route('signIn /auth/sign-in')} use:form.enhance>
		<TextField
			{form}
			name="email"
			type="email"
			autocomplete="email"
			label="Email"
			disabled={$isLoading}
		/>

		<PasswordField
			{form}
			name="password"
			label="Password"
			disabled={$isLoading}
			labelExtraClasses="mt-4"
		/>

		<div class="mt-4 flex justify-end">
			<a
				href={route('/auth/recover-password')}
				class="text-primary-800-200 text-sm underline-offset-4 hover:underline"
			>
				Forgot your password?
			</a>
		</div>

		<LoadableButton
			classes="btn preset-filled-primary-200-800 mt-6 w-full"
			disabled={$isLoading}
			isLoading={$isLoading}
		>
			sign in
		</LoadableButton>

		<AuthRedirectLink
			linkLabel="sign-up"
			href={route('/auth/sign-up')}
			question="Don't have an account?"
		/>
	</form>
</AuthPagesLayout>
