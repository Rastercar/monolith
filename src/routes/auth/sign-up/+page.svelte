<script lang="ts">
	import { goto } from '$app/navigation';
	import { apiSignUp } from '$lib/api/auth';
	import { signUpSchema, type SignUpDto } from '$lib/api/auth.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PasswordInput from '$lib/components/form/PasswordInput.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import { EMAIL_IN_USE, USERNAME_IN_USE } from '$lib/constants/error-codes';
	import { authStore } from '$lib/store/auth';
	import { getToaster } from '$lib/store/toaster';
	import { createMutation } from '@tanstack/svelte-query';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import AuthPagesLayout from '../components/AuthPagesLayout.svelte';
	import AuthRedirectLink from '../components/AuthRedirectLink.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const toaster = getToaster();

	const form = superForm(data.form, { validators: zodClient(signUpSchema) });

	const handleSignUpError = (err: string) => {
		const setFieldError = (field: 'email' | 'username', msg: string) => {
			form.validate(field, { value: '', errors: msg, update: 'errors' });
		};

		if (err === EMAIL_IN_USE) return setFieldError('email', 'email not available');
		if (err === USERNAME_IN_USE) return setFieldError('username', 'username not available');
	};

	const mutation = createMutation({
		mutationFn: (body: SignUpDto) => apiSignUp(body),
		onSuccess: (res) => {
			if (typeof res === 'string') return handleSignUpError(res);

			redirecting = true;

			authStore.setUser(res.user);

			// redirect a few frames after svelte updated the auth store
			setTimeout(() => {
				goto('/client').finally(() => (redirecting = false));
			}, 100);
		},
		onError: () => toaster.error()
	});

	const handleSignUp = async () => {
		const validated = await form.validateForm();

		if (!validated.valid) {
			return form.restore({ ...validated, tainted: undefined });
		}

		$mutation.mutate(validated.data);
	};

	/**
	 * if the sign up has succeeded and the user is being redirected
	 */
	let redirecting = false;

	$: isLoading = redirecting || $mutation.isPending;
</script>

<AuthPagesLayout title="Sign Up." subtitle="Join best car tracking app in seconds!">
	<TextInput {form} field="email" label="Email" placeholder="email address" disabled={isLoading} />

	<TextInput {form} field="username" label="Username" placeholder="username" disabled={isLoading} />

	<PasswordInput {form} field="password" disabled={isLoading} />

	<PasswordInput
		{form}
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
