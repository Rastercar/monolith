<script lang="ts">
	import { removeUserProfilePicture, updateUserProfilePicture } from '$lib/api/user';
	import FileDropzone from '$lib/components/dropzone/FileDropzone.svelte';
	import { authStore } from '$lib/store/auth.svelte';
	import { getToaster } from '$lib/store/toaster';
	import { cloudFrontUrl } from '$lib/utils/url';

	const toaster = getToaster();

	const onUploadSuccess = (profilePicture: string) => {
		toaster.success('profile picture changed successfully');
		authStore.updateUser({ profilePicture });
	};

	const onDeleteSuccess = () => authStore.updateUser({ profilePicture: null });

	$: ({ user } = $authStore);
</script>

{#if user}
	<FileDropzone
		deleteConfirmPrompt="Are you sure you want to delete your profile picture"
		{onDeleteSuccess}
		{onUploadSuccess}
		deleteMutationFn={removeUserProfilePicture}
		uploadMutationFn={updateUserProfilePicture}
		defaultSrc={user.profilePicture ? cloudFrontUrl(user.profilePicture) : undefined}
	/>
{/if}
