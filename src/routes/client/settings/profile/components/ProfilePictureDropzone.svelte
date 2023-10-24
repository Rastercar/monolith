<script lang="ts">
	import { removeUserProfilePicture, updateUserProfilePicture } from '$lib/api/user';
	import FileDropzone from '$lib/components/dropzone/FileDropzone.svelte';
	import { authStore } from '$lib/store/auth';
	import { cloudFrontUrl } from '$lib/utils/url';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	const onUploadSuccess = (profilePicture: string) => {
		toastStore.trigger({
			message: 'profile picture changed successfully',
			background: 'variant-filled-success'
		});
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
