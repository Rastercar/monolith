<script lang="ts">
	import { fileIsImage } from '$lib/utils/file';
	import Icon from '@iconify/svelte';
	import { Avatar, getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	export let defaultSrc: string = '';

	let newPhoto: null | { preview: string; file: File } = null;
	let filePicker: HTMLInputElement | null = null;

	let isDraggingFile = false;

	const showErrorToast = () => {
		toastStore.trigger({
			message: 'file is not a valid image',
			background: 'variant-filled-error'
		});
	};

	const onDrop = (e: DragEvent) => {
		isDraggingFile = false;

		const file = e.dataTransfer?.files[0];

		file && fileIsImage(file) ? previewFile(file) : showErrorToast();
	};

	const onFileSelected = (e: Event) => {
		const target = e.target as HTMLInputElement;

		const file = target.files?.[0];

		file && fileIsImage(file) ? previewFile(file) : showErrorToast();
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
		const filePickerEl = filePicker;
		if (filePickerEl) filePickerEl.value = '';
	};

	const uploadFile = () => {};

	// const uploadFile = () => {
	// 	if (!newPhoto.value?.file) return;

	// 	mutateAsync(newPhoto.value?.file)
	// 		.then((newProfilePicture) => {
	// 			authStore.updateUser({ profilePicture: newProfilePicture });
	// 			newPhoto.value = null;
	// 		})
	// 		.catch(() => {
	// 			newPhoto.value = null;
	// 			toast.error('failed to upload your new profile picture');
	// 		});
	// };

	$: overlayClass = isDraggingFile ? 'z-10 opacity-80' : '-z-10 opacity-0';

	$: containerClass = isDraggingFile
		? 'border-slate-500 opacity-40'
		: `border-transparent ${newPhoto ? 'border-slate-500' : ''}`;
</script>

<div
	class={`flex bg-surface-300-600-token relative h-40 py-4 border-dashed border-2 rounded-lg z-20 ${containerClass}`}
	role="button"
	tabindex="-1"
	aria-label="dropzone"
	on:drop={onDrop}
	on:dragenter={() => {
		isDraggingFile = true;
	}}
	on:dragleave={() => {
		isDraggingFile = false;
	}}
	on:dragover={() => {}}
>
	{#if newPhoto?.preview || defaultSrc}
		<Avatar
			src={newPhoto?.preview ?? defaultSrc}
			class="mx-auto pointer-events-none relative"
			rounded="rounded-full"
		/>
	{:else}
		<div class="bg-gray-600 h-full w-full items-center justify-center flex flex-col">
			no picture
		</div>
	{/if}

	<div
		class={`flex pointer-events-none justify-center items-center w-full h-full absolute top-0 left-0 bg-slate-900 rounded-lg ${overlayClass}`}
	>
		<span class="text-xl">DROP PHOTO HERE</span>
	</div>

	<div class="w-sm absolute top-3 right-3 rounded-lg">
		<div class:hidden={newPhoto === null}>
			<!-- TODO: loading -->
			<button class="btn-icon btn-icon-sm bg-green-500 mr-4" on:click={uploadFile}>
				<Icon icon="mdi:check" />
			</button>

			<!-- TODO: :disabled="isLoading" -->
			<button class="btn-icon btn-icon-sm bg-red-500" on:click={clearPreview}>
				<Icon icon="mdi:close" />
			</button>
		</div>

		<div class:hidden={newPhoto !== null}>
			<!-- TODO: :disabled="isLoading", pencil icon  -->

			<button class="btn-icon btn-icon-sm" on:click={() => filePicker?.click()}>
				<Icon icon="mdi:pencil" />
			</button>

			<input type="file" class="hidden" bind:this={filePicker} on:change={onFileSelected} />
		</div>
	</div>
</div>
