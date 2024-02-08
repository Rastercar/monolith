<script lang="ts">
	import { getToaster } from '$lib/store/toaster';
	import Icon from '@iconify/svelte';
	import { Avatar, getModalStore, type ModalComponent } from '@skeletonlabs/skeleton';
	import { createMutation } from '@tanstack/svelte-query';
	import FileDropzoneCropper from './FileDropzoneCropper.svelte';

	type UploadReturn = $$Generic;

	type DeleteReturn = $$Generic;

	export let defaultSrc: string = '';

	export let deleteConfirmPrompt: string;

	export let showCropperOnFileSelection = true;

	export let border = 'border-dashed border-2';

	export let uploadMutationFn: (file: File) => Promise<UploadReturn>;

	export let deleteMutationFn: () => Promise<DeleteReturn>;

	export let onUploadSuccess: (uploadResult: UploadReturn) => void = () => {};

	export let onDeleteSuccess: (deleteResult: DeleteReturn) => void = () => {};

	const toaster = getToaster();
	const modalStore = getModalStore();

	const uploadMutation = createMutation({ mutationFn: uploadMutationFn });
	const deleteMutation = createMutation({ mutationFn: deleteMutationFn });

	let newPhoto: null | { preview: string; file: File } = null;

	/**
	 * Ref to the hidden filepicker element
	 */
	let filePicker: HTMLInputElement;

	/**
	 * A file is being dragged onto the dropzone
	 */
	let isDraggingFile = false;

	const openCropperModal = (file: File) => {
		const component: ModalComponent = {
			ref: FileDropzoneCropper,
			props: { image: URL.createObjectURL(file) }
		};

		modalStore.trigger({ component, type: 'component', response: onModalEvent });
	};

	const loadPreview = (file?: File) => {
		if (!file) return toaster.error('file is not a valid image');

		showCropperOnFileSelection ? openCropperModal(file) : previewFile(file);
	};

	/**
	 * clears the new photo and the hidden file input state
	 */
	const clearPreview = () => {
		newPhoto = null;
		filePicker.value = '';
		filePicker.files = null;
	};

	/**
	 * Displays a image on the main div
	 */
	const previewFile = (file: File) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onloadend = () => {
			if (typeof reader.result !== 'string') return;
			newPhoto = { preview: reader.result, file };
		};
	};

	/**
	 * whenever a file is selected by the hidden
	 * input of type="file"
	 */
	const onFileSelected = (e: Event) => {
		const target = e.target as HTMLInputElement;
		loadPreview(target.files?.[0]);
	};

	const onDrop = (e: DragEvent) => {
		isDraggingFile = false;
		loadPreview(e.dataTransfer?.files[0]);
	};

	const onModalEvent = (modalEvent?: 'close' | { image: Blob }) => {
		if (!modalEvent) return;

		modalStore.close();

		if (typeof modalEvent === 'string') return;

		previewFile(new File([modalEvent.image], 'picture.jpeg'));
	};

	const uploadFile = () => {
		if (!newPhoto?.file) return;

		$uploadMutation
			.mutateAsync(newPhoto.file)
			.then((uploadResult) => onUploadSuccess(uploadResult))
			.catch(() => toaster.error('failed to upload picture'))
			.finally(() => {
				newPhoto = null;
			});
	};

	const deleteFile = () => {
		if (!confirm(deleteConfirmPrompt)) return;

		$deleteMutation
			.mutateAsync()
			.then((deletionResult) => onDeleteSuccess(deletionResult))
			.catch(() => toaster.error('failed to remove picture'))
			.finally(() => {
				newPhoto = null;
			});
	};

	$: overlayClass = isDraggingFile ? 'opacity-80' : '-z-10 opacity-0';

	$: containerClass = isDraggingFile
		? 'border-slate-500 opacity-40'
		: `border-transparent ${newPhoto ? 'border-slate-500' : ''}`;

	$: hasPictureToShow = newPhoto?.preview || defaultSrc;
</script>

<div
	class={`flex bg-surface-300-600-token relative h-54 rounded-lg ${border} ${containerClass}`}
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
		<slot name="preview" previewSrc={newPhoto?.preview ?? defaultSrc}>
			<Avatar
				src={newPhoto?.preview ?? defaultSrc}
				class="mx-auto pointer-events-none"
				width="w-48 my-4"
				rounded="rounded-full"
			/>
		</slot>
	{:else}
		<div class="w-full items-center justify-center flex flex-col h-48 pointer-events-none">
			no picture
		</div>
	{/if}

	<div
		class={`flex pointer-events-none justify-center items-center w-full h-full absolute top-0 left-0 bg-slate-900 rounded-lg ${overlayClass}`}
	>
		<span class="text-xl">DROP PHOTO HERE</span>
	</div>

	<div class="w-sm absolute top-3 right-3 rounded-lg">
		<div class:hidden={newPhoto === null} class="flex flex-col space-y-4">
			<button
				disabled={$uploadMutation.isPending}
				class="btn-icon btn-icon-sm bg-green-500 dark:bg-green-700"
				on:click={uploadFile}
			>
				<Icon
					icon={$uploadMutation.isPending ? 'mdi:loading' : 'mdi:check'}
					class={$uploadMutation.isPending ? 'animate-spin' : ''}
				/>
			</button>

			<button
				class="btn-icon btn-icon-sm bg-red-500 dark:bg-red-700"
				disabled={$uploadMutation.isPending}
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
				class="btn-icon btn-icon-sm variant-filled"
				disabled={$uploadMutation.isPending}
				on:click={() => filePicker.click()}
			>
				<Icon icon={hasPictureToShow ? 'mdi:pencil' : 'mdi:plus'} />
			</button>

			{#if hasPictureToShow}
				<button
					class="btn-icon btn-icon-sm variant-filled-warning"
					disabled={$uploadMutation.isPending}
					on:click={() => deleteFile()}
				>
					<Icon icon="mdi:trash" />
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
</div>
