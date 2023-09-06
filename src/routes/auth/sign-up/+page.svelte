<script lang="ts">
	import { goto } from '$app/navigation';
	import { apiSignIn } from '$lib/api/auth';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PasswordInput from '$lib/components/input/PasswordInput.svelte';
	import TextInput from '$lib/components/input/TextInput.svelte';
	import { authStore } from '$lib/store/auth';
	import {
		isEmail,
		isMatchingRegex,
		isMaxLen,
		isMinLen,
		isRequired,
		validatorChain,
		withMessage
	} from '$lib/utils/validators';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createMutation } from '@tanstack/svelte-query';
	import { superForm } from 'sveltekit-superforms/client';
	import AuthPagesLayout from '../components/AuthPagesLayout.svelte';
	import AuthRedirectLink from '../components/AuthRedirectLink.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const toastStore = getToastStore();

	const loginForm = superForm(data.form, {
		validators: {
			email: withMessage(isEmail, 'invalid email address'),
			// TODO: see: https://github.com/ciscoheat/sveltekit-superforms/issues/125
			passwordConfirmation: () => null,
			password: validatorChain([
				withMessage(isRequired, 'password is required'),
				withMessage(isMinLen(5), 'must contain at least 5 characters'),
				withMessage(isMaxLen(128), 'must contain less than 128 characters'),
				withMessage(isMatchingRegex(/[A-Z]/), 'must contain a uppercase character'),
				withMessage(isMatchingRegex(/[a-z]/), 'must contain a lowercase character'),
				withMessage(isMatchingRegex(/[0-9]/), 'must contain a number'),
				withMessage(
					isMatchingRegex(/[#?!@$%^&*-]/),
					'must contain a especial character (eg: #?!@$%^&*-)'
				)
			]),
			username: validatorChain([
				withMessage(isRequired, 'username is required'),
				withMessage(isMinLen(5), 'must contain at least 5 characters'),
				withMessage(isMaxLen(32), 'must contain less than 32 characters'),
				withMessage(
					isMatchingRegex(/^[a-z0-9_]+$/),
					'must contain only lowercase letters, numbers and underscores'
				)
			])
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

		loginForm.validate('passwordConfirmation', {
			value: '',
			errors: 'passwords do not match',
			update: 'errors'
		});

		if (!validated.valid) {
			loginForm.restore({ ...validated, tainted: undefined });
			return;
		}

		$mutation.mutate(validated.data);
	};
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
		on:click={handleSignIn}
	/>

	<AuthRedirectLink linkLabel="sign-in" href="/auth/sign-in" question="Already have an account?" />
</AuthPagesLayout>
