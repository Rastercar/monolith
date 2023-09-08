<script lang="ts">
	import { goto } from '$app/navigation';
	import { apiSignUp, type SignUpDto } from '$lib/api/auth';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PasswordInput from '$lib/components/input/PasswordInput.svelte';
	import TextInput from '$lib/components/input/TextInput.svelte';
	import { EMAIL_IN_USE, USERNAME_IN_USE } from '$lib/constants/error-codes';
	import { authStore } from '$lib/store/auth';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createMutation } from '@tanstack/svelte-query';
	import { superForm } from 'sveltekit-superforms/client';
	import { z } from 'zod';
	import AuthPagesLayout from '../components/AuthPagesLayout.svelte';
	import AuthRedirectLink from '../components/AuthRedirectLink.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const toastStore = getToastStore();

	const validators = z
		.object({
			email: z.string().email(),
			username: z
				.string()
				.min(5)
				.max(32)
				.regex(/^[a-z0-9_]+$/, 'must contain only lowercase letters, numbers and underscores'),
			password: z
				.string()
				.min(5)
				.max(128)
				.regex(/[A-Z]/, 'must contain a uppercase character')
				.regex(/[a-z]/, 'must contain a lowercase character')
				.regex(/[0-9]/, 'must contain a number')
				.regex(/[#?!@$%^&*-]/, 'must contain a especial character (eg: #?!@$%^&*-)'),
			passwordConfirmation: z.string().min(5)
		})
		.refine((data) => data.password == data.passwordConfirmation, {
			message: "Passwords didn't match",
			path: ['passwordConfirmation']
		});

	const loginForm = superForm(data.form, { validators });

	const handleSignUpError = (err: string) => {
		const setFieldError = (field: 'email' | 'username', msg: string) => {
			loginForm.validate(field, { value: '', errors: msg, update: 'errors' });
		};

		if (err === EMAIL_IN_USE) return setFieldError('email', 'email not available');
		if (err === USERNAME_IN_USE) return setFieldError('username', 'username not available');
	};

	const mutation = createMutation({
		mutationFn: (body: SignUpDto) => apiSignUp(body),
		onSuccess: (res) => {
			if (typeof res === 'string') return handleSignUpError(res);

			redirecting = true;

			authStore.update((v) => ({ ...v, user: res.user }));

			// redirect a few frames after svelte updated the auth store
			setTimeout(() => {
				goto('/client').finally(() => (redirecting = false));
			}, 100);
		},
		onError: () => {
			toastStore.trigger({
				message: 'a unknown error happened',
				background: 'variant-filled-error'
			});
		}
	});

	const handleSignUp = async () => {
		const validated = await loginForm.validate();

		if (!validated.valid) {
			return loginForm.restore({ ...validated, tainted: undefined });
		}

		const { passwordConfirmation, ...requestBody } = validated.data;

		$mutation.mutate(requestBody);
	};

	/**
	 * if the sign up has succeeded and the user is being redirected
	 */
	let redirecting = false;

	$: isLoading = redirecting || $mutation.isLoading;
</script>

<AuthPagesLayout title="Sign Up." subtitle="Join best car tracking app in seconds!">
	<TextInput
		form={loginForm}
		field="email"
		label="Email"
		placeholder="email address"
		disabled={isLoading}
	/>

	<TextInput
		form={loginForm}
		field="username"
		label="Username"
		placeholder="username"
		disabled={isLoading}
	/>

	<PasswordInput form={loginForm} field="password" disabled={isLoading} />

	<PasswordInput
		form={loginForm}
		label="Confirm Password"
		placeholder="Confirm Password"
		field="passwordConfirmation"
		disabled={isLoading}
	/>

	<LoadableButton
		class="btn variant-filled-primary mt-4 w-full"
		{isLoading}
		on:click={handleSignUp}
	>
		sign up
	</LoadableButton>

	<AuthRedirectLink linkLabel="sign-in" href="/auth/sign-in" question="Already have an account?" />
</AuthPagesLayout>
