<script lang="ts">
	import { goto } from '$app/navigation';
	import { apiSignIn, signInSchema, type SignInDto } from '$lib/api/auth';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PasswordInput from '$lib/components/input/PasswordInput.svelte';
	import TextInput from '$lib/components/input/TextInput.svelte';
	import { authStore } from '$lib/store/auth';
	import { getToaster } from '$lib/store/toaster';
	import { createMutation } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import AuthPagesLayout from '../components/AuthPagesLayout.svelte';
	import AuthRedirectLink from '../components/AuthRedirectLink.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const toaster = getToaster();

	const loginForm = superForm(data.form, { validators: signInSchema });

	const handleErrorResponse = (errorCode: string) => {
		const setFieldError = (field: 'email' | 'password', msg: string) => {
			loginForm.validate(field, { value: '', errors: msg, update: 'errors' });
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

			authStore.setUser(res.user);

			// redirect a few frames after svelte updated the auth store
			setTimeout(redirectAfterLogin, 100);
		},
		onError: () => toaster.error()
	});

	const handleSignIn = async () => {
		const validated = await loginForm.validate();

		if (!validated.valid) {
			loginForm.restore({ ...validated, tainted: undefined });
			return;
		}

		$mutation.mutate(validated.data);
	};

	// clear the user whenever loading this page, since if this page could only be loaded
	// if there is no current user session so any user on the auth store is outdated
	onMount(authStore.clearUser);

	/**
	 * if the login has succeeded and the user is being redirected
	 */
	let redirecting = false;

	$: isLoading = redirecting || $mutation.isLoading;
</script>

<AuthPagesLayout title="Welcome back." subtitle="Sign in to the best car tracking app!">
	<TextInput
		form={loginForm}
		field="email"
		label="Email"
		placeholder="email address"
		disabled={isLoading}
	/>

	<PasswordInput form={loginForm} field="password" disabled={isLoading} />

	<div class="mt-4 flex justify-end">
		<a
			href="/auth/recover-password"
			class="text-primary-700-200-token text-sm underline-offset-4 hover:underline"
		>
			Forgot your password?
		</a>
	</div>

	<LoadableButton
		class="btn variant-filled-primary mt-4 w-full"
		{isLoading}
		on:click={handleSignIn}
	>
		sign in
	</LoadableButton>

	<AuthRedirectLink linkLabel="sign-up" href="/auth/sign-up" question="Don't have an account?" />
</AuthPagesLayout>
