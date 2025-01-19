<script lang="ts">
	import { removeUserProfilePicture, updateUserProfilePicture } from '$lib/api/user';
	import FileDropzone from '$lib/components/dropzone/FileDropzone.svelte';
	import { getAuthContext } from '$lib/store/context';
	import { showSuccessToast } from '$lib/store/toast';
	import { cloudFrontUrl } from '$lib/utils/url';

	const auth = getAuthContext();

	const onUploadSuccess = (profilePicture: string) => {
		showSuccessToast('profile picture changed successfully');
		auth.updateUser({ profilePicture });
	};

	const onDeleteSuccess = () => auth.updateUser({ profilePicture: null });

	let { user } = $derived(auth);
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
