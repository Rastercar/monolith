<script lang="ts">
	import { signUpSchema } from '$lib/api/auth.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PasswordField from '$lib/components/form/v2/PasswordField.svelte';
	import TextField from '$lib/components/form/v2/TextField.svelte';
	import { route } from '$lib/ROUTES';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import AuthPagesLayout from '../components/AuthPagesLayout.svelte';
	import AuthRedirectLink from '../components/AuthRedirectLink.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const form = superForm(data.form, { validators: zodClient(signUpSchema) });
	const { delayed: isLoading } = form;

	// const handleSignUpError = (err: string) => {
	// 	const setFieldError = (field: 'email' | 'username', msg: string) => {
	// 		form.validate(field, { value: '', errors: msg, update: 'errors' });
	// 	};

	// 	if (err === EMAIL_IN_USE) return setFieldError('email', 'email not available');
	// 	if (err === USERNAME_IN_USE) return setFieldError('username', 'username not available');
	// };

	// const mutation = createMutation({
	// 	mutationFn: (body: SignUpDto) => apiSignUp(body),
	// 	onSuccess: (res) => {
	// 		if (typeof res === 'string') return handleSignUpError(res);

	// 		redirecting = true;

	// 		authStore.setUser(res.user);

	// 		// redirect a few frames after svelte updated the auth store
	// 		setTimeout(() => {
	// 			goto('/client').finally(() => (redirecting = false));
	// 		}, 100);
	// 	},
	// 	onError: () => toaster.error()
	// });

	// const handleSignUp = async () => {
	// 	const validated = await form.validateForm();

	// 	if (!validated.valid) {
	// 		return form.restore({ ...validated, tainted: undefined });
	// 	}

	// 	$mutation.mutate(validated.data);
	// };
</script>

<AuthPagesLayout title="Sign Up." subtitle="Join best car tracking app in seconds!">
	<TextField {form} name="email" label="Email" placeholder="email address" disabled={$isLoading} />

	<TextField {form} name="username" label="Username" placeholder="username" disabled={$isLoading} />

	<PasswordField {form} name="password" label="Password" disabled={$isLoading} />

	<PasswordField
		{form}
		name="passwordConfirmation"
		label="Confirm Password"
		placeholder="Confirm Password"
		disabled={$isLoading}
	/>

	<LoadableButton
		classes="btn preset-filled mt-4 w-full"
		disabled={$isLoading}
		isLoading={$isLoading}
	>
		sign up
	</LoadableButton>

	<AuthRedirectLink
		linkLabel="sign-in"
		href={route('/auth/sign-in')}
		question="Already have an account?"
	/>
</AuthPagesLayout>
