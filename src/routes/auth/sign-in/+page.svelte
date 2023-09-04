<script lang="ts">
	import { goto } from '$app/navigation';
	import { apiSignIn } from '$lib/api/auth';
	import TextInput from '$lib/components/input/TextInput.svelte';
	import { authStore } from '$lib/store/auth';
	import { isEmail, isRequired } from '$lib/utils/validators';
	import Icon from '@iconify/svelte';
	import { LightSwitch, ProgressRadial, getToastStore } from '@skeletonlabs/skeleton';
	import { createMutation } from '@tanstack/svelte-query';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;

	const toastStore = getToastStore();

	const loginForm = superForm(data.form, {
		validators: {
			email: (v) => (isEmail(v) ? null : 'invalid email address'),
			password: (v: string) => (isRequired(v) ? null : 'password is required')
		}
	});

	const handleErrorResponse = (errorCode: string) => {
		if (errorCode === 'invalid_password') {
			loginForm.validate('password', { value: '', errors: 'wrong password', update: 'errors' });
			return;
		}

		if (errorCode === 'not_found') {
			loginForm.validate('email', {
				value: '',
				errors: 'account with email not found',
				update: 'errors'
			});
			return;
		}
	};

	/**
	 * if the login has succeeded and the user is being redirected
	 */
	let redirecting = false;

	$: isLoading = redirecting || $mutation.isLoading;

	const redirectAfterLogin = () => {
		const routeToRedirect =
			data.onSuccessRedirectTo === '/auth/sign-out' || data.onSuccessRedirectTo === null
				? '/client'
				: data.onSuccessRedirectTo;

		goto(routeToRedirect).finally(() => (redirecting = false));
	};

	const mutation = createMutation({
		mutationFn: (credentials: { email: string; password: string }) => apiSignIn(credentials),
		onSuccess: (res) => {
			if (typeof res === 'string') {
				handleErrorResponse(res);
				return;
			}

			redirecting = true;

			authStore.update((v) => ({ ...v, user: res.user }));

			// redirect a few frames after svelte updated the auth store
			setTimeout(redirectAfterLogin, 100);
		},
		onError: () => {
			toastStore.trigger({
				message: 'a unknown error happened',
				background: 'variant-filled-error'
			});
		}
	});

	const handleSignIn = async () => {
		const validated = await loginForm.validate();

		if (!validated.valid) {
			loginForm.restore({ ...validated, tainted: undefined });
			return;
		}

		$mutation.mutate(validated.data);
	};
</script>

<div class="flex min-h-screen">
	<div
		class="bg-surface-50-900-token relative hidden w-0 flex-1 items-center justify-center lg:flex lg:w-3/5"
	>
		<div class="mx-auto w-full h-full flex items-center justify-center max-w-4xl">
			<img src="/img/login-page-bg.svg" alt="login-page-background" class="max-w-xl mx-auto" />
		</div>
	</div>

	<div
		class="bg-surface-100-800-token relative flex flex-1 flex-col justify-center px-6 py-12 lg:w-2/5 lg:flex-none"
	>
		<div class="relative mx-auto w-full max-w-sm">
			<div class="flex w-full items-center justify-between">
				<a href="/" type="button" class="btn hover:text-primary-600-300-token px-0">
					<Icon icon="mdi:keyboard-backspace" />
					<span>Back to Home</span>
				</a>

				<LightSwitch />
			</div>

			<div>
				<h2 class="font-heading text-3xl font-medium mt-6">Welcome back.</h2>
				<p class="font-alt text-sm font-normal mb-6">Sign in to the best car tracking app!</p>

				<hr class="border-t-2 my-6" />

				<TextInput
					form={loginForm}
					field="email"
					label="Email"
					placeholder="email address"
					disabled={isLoading}
				/>

				<TextInput
					form={loginForm}
					field="password"
					label="Password"
					type="password"
					placeholder="password"
					disabled={isLoading}
				/>

				<div class="mt-4 flex justify-end">
					<a
						href="/auth/recover"
						class="text-primary-700-200-token text-sm underline-offset-4 hover:underline"
					>
						Forgot your password?
					</a>
				</div>

				<button
					class="btn variant-filled-primary mt-4 w-full"
					on:click={handleSignIn}
					disabled={isLoading}
				>
					{#if isLoading}
						<ProgressRadial value={undefined} width="w-6" />
					{:else if loginForm.errors}
						<div>sign in</div>
					{/if}
				</button>

				<div class="mt-4 flex justify-between">
					<span class="text-sm underline-offset-4 hover:underline"> Don't have an account? </span>

					<a
						href="/auth/recover"
						class="text-primary-700-200-token text-sm underline-offset-4 hover:underline"
					>
						sign-up
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
