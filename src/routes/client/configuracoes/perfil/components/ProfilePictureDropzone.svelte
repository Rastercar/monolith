<script lang="ts">
	import { apiRemoveUserProfilePicture, apiUpdateUserProfilePicture } from '$lib/api/user';
	import FileDropzone from '$lib/components/dropzone/FileDropzone.svelte';
	import { getAuthContext } from '$lib/store/context';
	import { showSuccessToast } from '$lib/store/toast';
	import { cloudFrontUrl } from '$lib/utils/url';

	const auth = getAuthContext();

	const onUploadSuccess = (profilePicture: string) => {
		showSuccessToast('foto de perfil alterada');
		auth.updateUser({ profilePicture });
	};

	const onDeleteSuccess = () => auth.updateUser({ profilePicture: null });

	let { user } = $derived(auth);
</script>

{#if user}
	<FileDropzone
		deleteConfirmPrompt="Deseja mesmo deletar sua foto de perfil?"
		{onDeleteSuccess}
		{onUploadSuccess}
		deleteMutationFn={apiRemoveUserProfilePicture}
		uploadMutationFn={apiUpdateUserProfilePicture}
		defaultSrc={user.profilePicture ? cloudFrontUrl(user.profilePicture) : undefined}
	/>
{/if}
