<script lang="ts">
	import { removeVehiclePhoto, updateVehiclePhoto } from '$lib/api/vehicle';
	import FileDropzone from '$lib/components/dropzone/FileDropzone.svelte';
	import { hasPermission } from '$lib/store/auth.svelte';
	import { getToaster } from '$lib/store/toaster';
	import { cloudFrontUrl } from '$lib/utils/url';
	import { createEventDispatcher } from 'svelte';

	interface Props {
		photo: string | null;
		vehicleId: number;
	}

	let { photo = $bindable(), vehicleId }: Props = $props();

	const toaster = getToaster();

	const onUploadSuccess = (newPhoto: string) => {
		photo = newPhoto;
		toaster.success('photo changed successfully');
		dispatch('photo-changed', newPhoto);
	};

	const onDeleteSuccess = () => {
		photo = null;
		dispatch('photo-changed', null);
	};

	const deleteMutationFn = () => removeVehiclePhoto(vehicleId);

	const uploadMutationFn = (file: File) => updateVehiclePhoto(vehicleId, file);

	const dispatch = createEventDispatcher<{ 'photo-changed': string | null }>();
</script>

<div class="mb-4">
	{#if $hasPermission('UPDATE_VEHICLE')}
		<FileDropzone
			deleteConfirmPrompt="Are you sure you want to remove the vehicle photo ?"
			border=""
			{onDeleteSuccess}
			{onUploadSuccess}
			{deleteMutationFn}
			{uploadMutationFn}
			showCropperOnFileSelection={false}
			defaultSrc={photo ? cloudFrontUrl(photo) : undefined}
		>
			{#snippet preview({ previewSrc })}
				<div class="w-full">
					<img src={previewSrc} alt="preview" class="h-60 w-full object-cover" />
				</div>
			{/snippet}
		</FileDropzone>
	{:else}
		<img class="h-60 w-full object-cover" src={photo ? cloudFrontUrl(photo) : ''} alt="vehicle" />
	{/if}
</div>
