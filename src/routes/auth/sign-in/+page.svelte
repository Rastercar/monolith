<script lang="ts">
	import { goto } from '$app/navigation';
	import { apiSignIn } from '$lib/api/auth';
	import { isApiErrorResponse } from '$lib/api/error';
	import InputErrorMessage from '$lib/components/input/InputErrorMessage.svelte';
	import { isEmail, isRequired } from '$lib/validators';
	import Icon from '@iconify/svelte';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { createMutation } from '@tanstack/svelte-query';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;

	const { form, errors, validate, restore } = superForm(data.form, {
		validators: {
			email: (email) => (isEmail(email) ? null : 'invalid email address'),
			password: (password) => (isRequired(password) ? null : 'password is required')
		}
	});

	const mutation = createMutation({
		mutationFn: (credentials: { email: string; password: string }) => apiSignIn(credentials),
		onSuccess: ({ responseData }) => {
			// TODO: store user / auth data on client side (local storage sync)
			console.log(responseData);

			// TODO: navigate according to type
			goto(data.onSuccessRedirectTo ?? '/admin');
		},
		onError: (e) => {
			if (isApiErrorResponse(e)) {
				// TODO: handle 404 (email not found) and 401 (invalid password)
				console.log(e.apiError);
				return;
			}

			// TODO: display some error toast ?
		}
	});

	const handleSignIn = async () => {
		const validated = await validate();

		if (!validated.valid) {
			restore({ ...validated, tainted: undefined });
			return;
		}

		$mutation.mutate(validated.data);

		// TODO: rm this comment
		// email: 'rastercar.tests.002@gmail.com',
		// password: 'testuser'
	};

	// TODO:
	// get session expiration from cookie on server side ?
	// google oauth
	// form loading state (disabled and loading spinner on button)
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
				<a
					href="/"
					type="button"
					class="btn hover:text-primary-600-300-token px-0"
					data-sveltekit-preload-data="hover"
				>
					<Icon icon="mdi:keyboard-backspace" />
					<span>Back to Home</span>
				</a>

				<LightSwitch />
			</div>

			<div>
				<h2 class="font-heading text-3xl font-medium mt-6">Welcome back.</h2>
				<p class="font-alt text-sm font-normal mb-6">Login with social media or your credentials</p>

				<div class="flex flex-wrap justify-between gap-4">
					<button class="btn variant-ringed grow py-4">
						<Icon icon="mdi:google" width="32" height="32" />
						<div>Login with Google</div>
					</button>
				</div>

				<div class="mt-6 mb-4 flex items-center">
					<hr class="flex-auto border-t-2" />

					<span class="px-4 font-sans font-light"> OR </span>

					<hr class="flex-auto border-t-2" />
				</div>

				<label class="label mb-1">
					<span class="text-sm">Email</span>
					<input
						class="input"
						type="email"
						name="email"
						placeholder="email address"
						aria-invalid={$errors.email ? 'true' : undefined}
						bind:value={$form.email}
					/>
				</label>
				<InputErrorMessage errors={$errors.email} />

				<label class="label mt-4 mb-1">
					<span class="text-sm">Password</span>
					<input
						class="input mb-1"
						type="password"
						name="password"
						placeholder="password"
						aria-invalid={$errors.password ? 'true' : undefined}
						bind:value={$form.password}
					/>
				</label>
				<InputErrorMessage errors={$errors.password} />

				<div class="mt-4 flex justify-end">
					<a
						href="/auth/recover"
						class="text-primary-700-200-token text-sm underline-offset-4 hover:underline"
					>
						Forgot your password?
					</a>
				</div>

				<button class="btn variant-filled-primary mt-4 w-full" on:click={handleSignIn}>
					<div>sign in</div>
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
