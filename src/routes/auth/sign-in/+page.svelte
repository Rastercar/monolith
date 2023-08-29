<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

	export let data: PageData;

	const signIn = async () => {
		const res = await fetch(`http://localhost:3000/auth/sign-in`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({
				email: 'rastercar.tests.002@gmail.com',
				password: 'testuser'
			})
		});

		const loginResponse = await res.json();

		// TODO: ???? goto no firing root hook
		// TODO: navigate according to type
		goto(data.onSuccessRedirectTo ?? '/admin');
	};

	// TODO:
	// useQuery
	// form validation
	// EMAIL_IN_USE error code
	// redirect to client application
	// get session expiration from cookie on server side ?
	// proper auth guard to routes
	// store user / auth data on client side (localstorage sync)
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

				<label class="label">
					<span class="text-sm">Email</span>
					<input class="input" type="email" placeholder="email address" />
				</label>

				<label class="label mt-4">
					<span class="text-sm">Password</span>
					<input class="input" type="email" placeholder="password" />
				</label>

				<div class="mt-4 flex justify-end">
					<a
						href="/auth/recover"
						class="text-primary-700-200-token text-sm underline-offset-4 hover:underline"
					>
						Forgot your password?
					</a>
				</div>

				<button class="btn variant-filled-primary mt-4 w-full" on:click={signIn}>
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
