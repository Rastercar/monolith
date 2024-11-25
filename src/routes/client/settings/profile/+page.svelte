<script lang="ts">
	import { apiUpdateUser } from '$lib/api/user';
	import { updateUserSchema, type UpdateUserBody } from '$lib/api/user.schema';
	import EmailNotConfirmedWarning from '$lib/components/button/EmailNotConfirmedWarning.svelte';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import TextAreaField from '$lib/components/form/TextAreaField.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import { getAuthContext } from '$lib/store/auth.svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	const form = superForm(data.form, { validators: zodClient(updateUserSchema) });

	const mutation = createMutation({
		mutationFn: (body: UpdateUserBody) => apiUpdateUser(body),

		onSuccess: (updatedUser) => {
			const { description, username, email } = updatedUser;
			// authStore.updateUser({ description, username, email });
			// toaster.success('profiled updated successfully');
		}
	});

	const auth = getAuthContext();

	const { email, description, username } = data.user;
	form.form.set({ email, description: description ?? '', username });
</script>

{#if auth.user}
	<h1 class="h1 mb-3">My Profile</h1>

	<!-- TODO: -->
	<!-- <ProfilePictureDropzone /> -->

	<form class="grid grid-cols-2 gap-4 my-4">
		<TextField {form} name="email" label="Email" />

		<TextField {form} maxlength={32} name="username" label="Username" />

		{#if !auth.user.emailVerified}
			<div class="mt-2 col-span-2">
				<EmailNotConfirmedWarning sendConfirmationEmailTo="user" />
			</div>
		{/if}

		<TextAreaField {form} name="description" label="Description" classes="col-span-2" rows={6} />

		<div class="col-span-2 flex justify-end">
			<LoadableButton classes="btn preset-filled-primary-300-700" isLoading={$mutation.isPending}>
				update
			</LoadableButton>
		</div>
	</form>
{/if}
