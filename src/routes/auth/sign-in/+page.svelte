<script lang="ts">
	import { goto } from '$app/navigation';
	import { apiSignIn } from '$lib/api/auth';
	import { signInSchema, type SignInDto } from '$lib/api/auth.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PasswordField from '$lib/components/form/v2/PasswordField.svelte';
	import TextField from '$lib/components/form/v2/TextField.svelte';
	import { route } from '$lib/ROUTES';
	import { createMutation } from '@tanstack/svelte-query';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import AuthPagesLayout from '../components/AuthPagesLayout.svelte';
	import AuthRedirectLink from '../components/AuthRedirectLink.svelte';

	const { data } = $props();

	const form = superForm(data.form, { validators: zodClient(signInSchema) });
	const { form: formData, enhance } = form;

	const handleErrorResponse = (errorCode: string) => {
		const setFieldError = (field: 'email' | 'password', msg: string) => {
			form.validate(field, { value: '', errors: msg, update: 'errors' });
		};

		if (errorCode === 'not_found') {
			return setFieldError('email', 'account with email not found');
		}

		if (errorCode === 'invalid_password') {
			return setFieldError('password', 'wrong password');
		}
	};

	const redirectAfterLogin = () => {
		const routeToRedirect =
			data.onSuccessRedirectTo === '/auth/sign-out' || data.onSuccessRedirectTo === null
				? '/client'
				: data.onSuccessRedirectTo;

		goto(routeToRedirect).finally(() => (redirecting = false));
	};

	const mutation = createMutation({
		mutationFn: (credentials: SignInDto) => apiSignIn(credentials),
		onSuccess: (res) => {
			if (typeof res === 'string') {
				handleErrorResponse(res);
				return;
			}

			redirecting = true;

			// authStore.setUser(res.user);

			// redirect a few frames after svelte updated the auth store
			setTimeout(redirectAfterLogin, 100);
		}
		// onError: () => toaster.error()
	});

	const handleSignIn = async () => {
		const validated = await form.validateForm();

		if (!validated.valid) {
			form.restore({ ...validated, tainted: undefined });
			return;
		}

		$mutation.mutate(validated.data);
	};

	// TODO: !
	// clear the user whenever loading this page, since if this page could only be loaded
	// if there is no current user session so any user on the auth store is outdated
	// onMount(authStore.clearUser);

	// TODO: ver a lib de formulario
	// se implementar com ela ou n, ver como vamos fazer a chamada de login

	/**
	 * if the login has succeeded and the user is being redirected
	 */
	let redirecting = $state(false);

	const isLoading = $derived(redirecting || $mutation.isPending);
</script>

<AuthPagesLayout title="Welcome back." subtitle="Sign in to the best car tracking app!">
	<form method="POST" action={route('signIn /auth/sign-in')} use:enhance>
		<TextField
			{form}
			name="email"
			type="email"
			autocomplete="email"
			label="Email"
			placeholder="email address"
			disabled={isLoading}
		/>

		<PasswordField {form} name="password" label="password" disabled={isLoading} />

		<div class="mt-4 flex justify-end">
			<a
				href={route('/auth/recover-password')}
				class="text-primary-800-200 text-sm underline-offset-4 hover:underline"
			>
				Forgot your password?
			</a>
		</div>

		<LoadableButton classes="btn preset-filled-primary-200-800 mt-4 w-full" {isLoading}>
			sign in
		</LoadableButton>

		<AuthRedirectLink
			linkLabel="sign-up"
			href={route('/auth/sign-up')}
			question="Don't have an account?"
		/>
	</form>
</AuthPagesLayout>
