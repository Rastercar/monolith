<script lang="ts">
	import { removeUserProfilePicture, updateUserProfilePicture } from '$lib/api/user';
	import EmailNotConfirmedWarning from '$lib/components/button/EmailNotConfirmedWarning.svelte';
	import FileDropzone from '$lib/components/dropzone/FileDropzone.svelte';
	import TextArea from '$lib/components/input/TextArea.svelte';
	import TextInput from '$lib/components/input/TextInput.svelte';
	import { authStore } from '$lib/store/auth';
	import { cloudFrontUrl } from '$lib/utils/url';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;

	const form = superForm(data.form);

	const toastStore = getToastStore();

	const onUploadSuccess = (profilePicture: string) => {
		toastStore.trigger({
			message: 'profile picture changed successfully',
			background: 'variant-filled-success'
		});
		authStore.updateUser({ profilePicture });
	};

	const onDeleteSuccess = () => authStore.updateUser({ profilePicture: null });

	onMount(() => {
		if (!user) return;

		const { email, description, username } = user;

		form.form.set({ email, description: description ?? '', username });
	});

	$: ({ user } = $authStore);
</script>

{#if user}
	<div class="p-6 max-w-4xl mx-auto">
		<h1 class="text-2xl mb-3">My Profile</h1>

		<FileDropzone
			deleteConfirmPrompt="Are you sure you want to delete your profile picture"
			{onDeleteSuccess}
			{onUploadSuccess}
			deleteMutationFn={removeUserProfilePicture}
			uploadMutationFn={updateUserProfilePicture}
			defaultSrc={user.profilePicture ? cloudFrontUrl(user.profilePicture) : undefined}
		/>

		<form class="space-y-4" method="post">
			<div class="block sm:flex space-x-0 sm:space-x-4">
				<TextInput {form} labelClass="label mt-4 mb-1 grow-0 sm:grow" field="email" label="Email" />

				<TextInput
					{form}
					labelClass="label mt-4 mb-1 grow-0 sm:grow"
					field="username"
					label="Username"
				/>
			</div>

			{#if !user.emailVerified}
				<EmailNotConfirmedWarning emailAddress={user.email} />
			{/if}

			<TextArea {form} field="description" label="Description" rows="6" />

			<div class="flex justify-end">
				<button type="submit" class="btn variant-filled-primary">update</button>
			</div>
		</form>
	</div>
{/if}
