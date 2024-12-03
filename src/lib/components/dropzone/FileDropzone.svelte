<script lang="ts">
	import { showErrorToast } from '$lib/store/toast';
	import Icon from '@iconify/svelte';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import { Dialog } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import FileDropzoneCropper from './FileDropzoneCropper.svelte';

	type UploadReturn = $$Generic;
	type DeleteReturn = $$Generic;

	interface Props {
		defaultSrc?: string;
		deleteConfirmPrompt: string;
		showCropperOnFileSelection?: boolean;
		border?: string;
		preview?: Snippet<[{ previewSrc: string }]>;
		deleteMutationFn: () => Promise<DeleteReturn>;
		uploadMutationFn: (_: File) => Promise<UploadReturn>;
		onUploadSuccess?: (_: UploadReturn) => void;
		onDeleteSuccess?: (_: DeleteReturn) => void;
	}

	let {
		defaultSrc = '',
		deleteConfirmPrompt,
		showCropperOnFileSelection = true,
		border = 'border-dashed border-2',
		preview,
		uploadMutationFn,
		deleteMutationFn,
		onUploadSuccess = () => undefined,
		onDeleteSuccess = () => undefined
	}: Props = $props();

	const uploadMutation = createMutation(() => ({ mutationFn: uploadMutationFn }));
	const deleteMutation = createMutation(() => ({ mutationFn: deleteMutationFn }));

	let newPhoto = $state<null | { preview: string; file: File }>(null);

	let isCropperModalOpen = $state(false);
	let image = $state('');

	/**
	 * Ref to the hidden filepicker element
	 */
	let filePicker = $state<HTMLInputElement>();

	/**
	 * A file is being dragged onto the dropzone
	 */
	let isDraggingFile = $state(false);

	const openCropperModal = (file: File) => {
		image = URL.createObjectURL(file);
		isCropperModalOpen = true;
	};

	const loadPreview = (file?: File) => {
		if (!file) return showErrorToast('file is not a valid image');

		showCropperOnFileSelection ? openCropperModal(file) : previewFile(file);
	};

	/**
	 * clears the new photo and the hidden file input state
	 */
	const clearPreview = () => {
		newPhoto = null;
		if (filePicker) {
			filePicker.value = '';
			filePicker.files = null;
		}
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

	const uploadFile = () => {
		if (!newPhoto?.file) return;

		uploadMutation
			.mutateAsync(newPhoto.file)
			.then((uploadResult) => onUploadSuccess(uploadResult))
			.catch(() => showErrorToast('failed to upload picture'))
			.finally(() => {
				newPhoto = null;
			});
	};

	const deleteFile = () => {
		if (!confirm(deleteConfirmPrompt)) return;

		deleteMutation
			.mutateAsync()
			.then((deletionResult) => onDeleteSuccess(deletionResult))
			.catch(() => showErrorToast('failed to remove picture'))
			.finally(() => {
				newPhoto = null;
			});
	};

	let overlayClass = $derived(isDraggingFile ? 'opacity-80' : '-z-10 opacity-0');

	let containerClass = $derived(
		isDraggingFile
			? 'border-slate-500 opacity-40'
			: `border-transparent ${newPhoto ? 'border-slate-500' : ''}`
	);

	let hasPictureToShow = $derived(newPhoto?.preview || defaultSrc);
</script>

<div
	class={`flex bg-surface-300-600-token relative h-54 rounded-lg ${border} ${containerClass}`}
	role="button"
	tabindex="-1"
	aria-label="dropzone"
	ondrop={(e) => {
		e.preventDefault();
		onDrop(e);
	}}
	ondragenter={() => {
		isDraggingFile = true;
	}}
	ondragleave={() => {
		isDraggingFile = false;
	}}
	ondragover={(e) => e.preventDefault()}
>
	{#if hasPictureToShow}
		{#if preview}
			{@render preview({ previewSrc: newPhoto?.preview ?? defaultSrc })}
		{:else}
			<Avatar
				name="TODO"
				src={newPhoto?.preview ?? defaultSrc}
				classes="mx-auto pointer-events-none h-48 w-48"
			/>
		{/if}
	{:else}
		<div
			class="w-full items-center justify-center flex flex-col h-48 pointer-events-none border-surface-300-700 border-2 border-dashed rounded"
		>
			no picture
		</div>
	{/if}

	<div
		class={`flex pointer-events-none justify-center items-center w-full h-full absolute top-0 left-0 bg-slate-900 rounded ${overlayClass}`}
	>
		<span class="text-xl">DROP PHOTO HERE</span>
	</div>

	<div class="w-sm absolute top-3 right-3 rounded-lg">
		<div class:hidden={newPhoto === null} class="flex flex-col space-y-4">
			<button
				disabled={uploadMutation.isPending}
				class="btn-icon preset-filled-success-300-700"
				onclick={uploadFile}
			>
				<Icon
					icon={uploadMutation.isPending ? 'mdi:loading' : 'mdi:check'}
					class={uploadMutation.isPending ? 'animate-spin' : ''}
				/>
			</button>

			<button
				class="btn-icon preset-filled-error-300-700"
				disabled={uploadMutation.isPending}
				onclick={clearPreview}
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
				class="btn-icon preset-filled-primary-300-700"
				disabled={uploadMutation.isPending}
				onclick={() => filePicker?.click()}
			>
				<Icon icon={hasPictureToShow ? 'mdi:pencil' : 'mdi:plus'} />
			</button>

			{#if hasPictureToShow}
				<button
					class="btn-icon preset-filled-error-300-700"
					disabled={uploadMutation.isPending}
					onclick={() => deleteFile()}
				>
					<Icon icon="mdi:trash" />
				</button>
			{/if}

			<input
				type="file"
				accept=".jpg, .jpeg, .png, .webp"
				class="hidden"
				bind:this={filePicker}
				onchange={onFileSelected}
			/>
		</div>
	</div>
</div>

<Dialog.Root bind:open={isCropperModalOpen}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
		<Dialog.Content
			class="fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] rounded-card-lg border bg-background p-5 shadow-popover outline-none sm:max-w-[490px] md:w-full"
		>
			<FileDropzoneCropper
				{image}
				onClose={() => (isCropperModalOpen = false)}
				onImageCropped={(blob) => {
					previewFile(new File([blob], 'picture.jpeg'));
					isCropperModalOpen = false;
				}}
			/>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
