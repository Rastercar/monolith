<script lang="ts">
	import { removeVehiclePhoto, updateVehiclePhoto } from '$lib/api/vehicle';
	import FileDropzone from '$lib/components/dropzone/FileDropzone.svelte';
	import { getAuthContext } from '$lib/store/context';
	import { showSuccessToast } from '$lib/store/toast';
	import { cloudFrontUrl } from '$lib/utils/url';

	interface Props {
		photo: string | null;
		vehicleId: number;
		onPhotoChange: (_: string | null) => void;
	}

	let { photo, vehicleId, onPhotoChange }: Props = $props();

	const auth = getAuthContext();

	const uploadMutationFn = (file: File) => updateVehiclePhoto(vehicleId, file);

	const onUploadSuccess = (newPhoto: string) => {
		showSuccessToast('photo changed');
		onPhotoChange(newPhoto);
	};

	const deleteMutationFn = () => removeVehiclePhoto(vehicleId);

	const onDeleteSuccess = () => {
		onPhotoChange(null);
	};

	const imgClasses = 'h-60 w-full object-cover';
</script>

{#if auth.hasPermission('UPDATE_VEHICLE')}
	<FileDropzone
		border=""
		deleteConfirmPrompt="Are you sure you want to remove the vehicle photo ?"
		{onDeleteSuccess}
		{onUploadSuccess}
		{deleteMutationFn}
		{uploadMutationFn}
		showCropperOnFileSelection={false}
		defaultSrc={photo ? cloudFrontUrl(photo) : undefined}
	>
		{#snippet preview({ previewSrc })}
			<div class="w-full">
				<img src={previewSrc} alt="preview" class={imgClasses} />
			</div>
		{/snippet}
	</FileDropzone>
{:else}
	<img class={imgClasses} src={photo ? cloudFrontUrl(photo) : ''} alt="vehicle" />
{/if}
