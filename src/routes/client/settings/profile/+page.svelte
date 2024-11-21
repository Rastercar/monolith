<script lang="ts">
	import { apiUpdateUser } from '$lib/api/user';
	import { updateUserSchema, type UpdateUserBody } from '$lib/api/user.schema';
	import EmailNotConfirmedWarning from '$lib/components/button/EmailNotConfirmedWarning.svelte';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import TextArea from '$lib/components/form/TextArea.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import { authStore } from '$lib/store/auth.svelte';
	import { getToaster } from '$lib/store/toaster';
	import { createMutation } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import ProfilePictureDropzone from './components/ProfilePictureDropzone.svelte';

	let { data } = $props();

	const toaster = getToaster();

	const form = superForm(data.form, { validators: zodClient(updateUserSchema) });

	const mutation = createMutation({
		mutationFn: (body: UpdateUserBody) => apiUpdateUser(body),

		onSuccess: (updatedUser) => {
			const { description, username, email } = updatedUser;
			authStore.updateUser({ description, username, email });
			toaster.success('profiled updated successfully');
		},

		onError: () => toaster.error()
	});

	const updateProfile = async () => {
		const validated = await form.validateForm();

		if (!validated.valid) {
			form.restore({ ...validated, tainted: undefined });
			return;
		}

		$mutation.mutate(validated.data);
	};

	onMount(() => {
		if (!user) return;

		const { email, description, username } = user;

		form.form.set({ email, description: description ?? '', username });
	});

	let { user } = $derived($authStore);
</script>

{#if user}
	<h1 class="text-2xl mb-3">My Profile</h1>

	<ProfilePictureDropzone />

	<div class="grid grid-cols-2 gap-4 my-4">
		<TextInput {form} class="label sm:col-span-1 col-span-2" field="email" label="Email" />

		<TextInput
			{form}
			class="label sm:col-span-1 col-span-2"
			maxlength="32"
			field="username"
			label="Username"
		/>

		{#if !user.emailVerified}
			<div class="mt-2 col-span-2">
				<EmailNotConfirmedWarning sendConfirmationEmailTo="user" />
			</div>
		{/if}

		<TextArea class="label col-span-2" {form} field="description" label="Description" rows="6" />
	</div>

	<div class="flex justify-end">
		<LoadableButton
			class="btn variant-filled-primary"
			isLoading={$mutation.isPending}
			on:click={updateProfile}
		>
			update
		</LoadableButton>
	</div>
{/if}
