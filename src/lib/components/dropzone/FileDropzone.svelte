<script lang="ts">
	import CropperModal from './CropperModal.svelte';

	import { fileIsImage } from '$lib/utils/file';
	import Icon from '@iconify/svelte';
	import { Avatar, getToastStore } from '@skeletonlabs/skeleton';
	import { createMutation } from '@tanstack/svelte-query';

	type UploadReturn = $$Generic;

	type DeleteReturn = $$Generic;

	export let uploadMutationFn: (file: File) => Promise<UploadReturn>;

	export let onUploadSuccess: (uploadResult: UploadReturn) => void;

	export let deleteMutationFn: () => Promise<DeleteReturn>;

	export let onDeleteSuccess: (deleteResult: DeleteReturn) => void;

	export let defaultSrc: string = '';

	export let deleteConfirmPrompt: string;

	const toastStore = getToastStore();

	let newPhoto: null | { preview: string; file: File } = null;

	let filePicker: HTMLInputElement;

	let isDraggingFile = false;

	const showErrorToast = (message: string) => {
		toastStore.trigger({ message, background: 'variant-filled-error' });
	};

	const onDrop = (e: DragEvent) => {
		isDraggingFile = false;
		loadPreview(e.dataTransfer?.files[0]);
	};

	const onFileSelected = (e: Event) => {
		const target = e.target as HTMLInputElement;
		loadPreview(target.files?.[0]);
	};

	const loadPreview = (file?: File) => {
		file && fileIsImage(file) ? previewFile(file) : showErrorToast('file is not a valid image');
	};

	const previewFile = (file: File) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onloadend = () => {
			if (typeof reader.result === 'string') {
				newPhoto = { preview: reader.result, file };
			}
		};
	};

	const clearPreview = () => {
		newPhoto = null;
		filePicker.value = '';
	};

	const mutation = createMutation({ mutationFn: uploadMutationFn });

	const uploadFile = () => {
		if (!newPhoto?.file) return;

		$mutation
			.mutateAsync(newPhoto.file)
			.then((uploadResult) => onUploadSuccess(uploadResult))
			.catch(() => showErrorToast('failed to upload picture'))
			.finally(() => {
				newPhoto = null;
			});
	};

	const deleteMutation = createMutation({ mutationFn: deleteMutationFn });

	const deleteFile = () => {
		if (!confirm(deleteConfirmPrompt)) return;

		$deleteMutation
			.mutateAsync()
			.then((deletionResult) => onDeleteSuccess(deletionResult))
			.catch(() => showErrorToast('failed to remove picture'))
			.finally(() => {
				newPhoto = null;
			});
	};

	$: overlayClass = isDraggingFile ? 'z-10 opacity-80' : '-z-10 opacity-0';

	$: containerClass = isDraggingFile
		? 'border-slate-500 opacity-40'
		: `border-transparent ${newPhoto ? 'border-slate-500' : ''}`;

	$: hasPictureToShow = newPhoto?.preview || defaultSrc;
</script>

<div
	class={`flex bg-surface-300-600-token relative h-54 py-4 border-dashed border-2 rounded-lg z-20 ${containerClass}`}
	role="button"
	tabindex="-1"
	aria-label="dropzone"
	on:drop|preventDefault={onDrop}
	on:dragenter={() => {
		isDraggingFile = true;
	}}
	on:dragleave={() => {
		isDraggingFile = false;
	}}
	on:dragover|preventDefault={() => {}}
>
	{#if hasPictureToShow}
		<Avatar
			src={newPhoto?.preview ?? defaultSrc}
			class="mx-auto pointer-events-none"
			width="w-48"
			rounded="rounded-full"
		/>
	{:else}
		<div class="w-full items-center justify-center flex flex-col h-48">no picture</div>
	{/if}

	<div
		class={`flex pointer-events-none justify-center items-center w-full h-full absolute top-0 left-0 bg-slate-900 rounded-lg ${overlayClass}`}
	>
		<span class="text-xl">DROP PHOTO HERE</span>
	</div>

	<div class="w-sm absolute top-3 right-3 rounded-lg">
		<div class:hidden={newPhoto === null}>
			<button
				disabled={$mutation.isLoading}
				class="btn-icon btn-icon-sm bg-green-500 dark:bg-green-700 mr-2"
				on:click={uploadFile}
			>
				<Icon
					icon={$mutation.isLoading ? 'mdi:loading' : 'mdi:check'}
					class={$mutation.isLoading ? 'animate-spin' : ''}
				/>
			</button>

			<button
				class="btn-icon btn-icon-sm bg-red-500 dark:bg-red-700"
				disabled={$mutation.isLoading}
				on:click={clearPreview}
			>
				<Icon icon="mdi:close" />
			</button>
		</div>

		<div
			class="flex flex-col space-y-4"
			class:hidden={newPhoto !== null}
			class:pointer-events-none={isDraggingFile}
		>
			<button
				class="btn btn-sm variant-filled"
				disabled={$mutation.isLoading}
				on:click={() => filePicker.click()}
			>
				{hasPictureToShow ? 'edit' : 'add picture'}
				<Icon icon="mdi:pencil" class={hasPictureToShow ? 'ml-auto' : 'ml-2'} />
			</button>

			{#if hasPictureToShow}
				<button
					class="btn btn-sm variant-filled-warning"
					disabled={$mutation.isLoading}
					on:click={() => deleteFile()}
				>
					remove
					<Icon icon="mdi:trash" class="ml-2" />
				</button>
			{/if}

			<input
				type="file"
				accept=".jpg, .jpeg, .png, .webp"
				class="hidden"
				bind:this={filePicker}
				on:change={onFileSelected}
			/>
		</div>
	</div>

	<!-- 
		TODO: finish me, when a file is dropped or selected, the cropper modal should open, and when the cropper modal finishes the resulting file should
		be uploaded and set as the preview
	 -->
	<CropperModal />
</div>
