<script lang="ts">
	import Icon from '@iconify/svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import Cropper from 'svelte-easy-crop';
	import type { CropArea, DispatchEvents, Point } from 'svelte-easy-crop/types';

	// Just to avoid this warning:
	// FileDropzoneCropper.svelte:79 <FileDropzoneCropper> was created with unknown prop 'parent'
	export let parent: unknown = null;
	if (2 + 2 === 5) parent = null;

	export let image: string | null = null;

	let crop: Point = { x: 0, y: 0 };

	let pixelCrop: CropArea | null = null;

	let isCropping = false;

	const modalStore = getModalStore();

	const createImage = (url: string): Promise<HTMLImageElement> => {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.addEventListener('load', () => resolve(image));
			image.addEventListener('error', (error) => reject(error));
			image.src = url;
		});
	};

	const getCroppedImg = async (): Promise<Blob | null> => {
		if (!image || !pixelCrop) return null;

		const imgElement = await createImage(image);
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		if (!ctx) throw new Error('cannot get cropper canvas');

		// set canvas size to match the bounding box
		canvas.width = imgElement.width;
		canvas.height = imgElement.height;

		ctx.drawImage(imgElement, 0, 0);

		// croppedAreaPixels values are bounding box relative
		const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

		// set canvas width to final desired crop size - this will clear existing context
		canvas.width = pixelCrop.width;
		canvas.height = pixelCrop.height;

		// paste generated image at the top left corner
		ctx.putImageData(data, 0, 0);

		return new Promise((resolve) => {
			canvas.toBlob((file) => {
				resolve(file);
			}, 'image/jpeg');
		});
	};

	const previewCrop = (e: CustomEvent<DispatchEvents['cropcomplete']>) => {
		pixelCrop = e.detail.pixels;
	};

	const close = () => {
		image = null;
		$modalStore[0].response?.('close');
	};

	const onCropClick = async () => {
		isCropping = true;

		const croppedImg = await getCroppedImg().finally(() => {
			isCropping = false;
		});

		if (croppedImg) {
			$modalStore[0].response?.({ image: croppedImg });
		}
	};
</script>

<div class="bg-surface-500 p-2">
	<div class="w-80 h-[500px] relative">
		{#if image}
			<Cropper {image} {crop} zoom={1} on:cropcomplete={previewCrop} aspect={1} cropShape="round" />
		{/if}
	</div>

	<div class="flex justify-end space-x-2">
		<button type="button" class="btn btn-sm mt-2 variant-filled-warning" on:click={() => close()}>
			<Icon icon="mdi:cancel" class="mr-2" />
			cancel
		</button>

		<button type="button" class="btn btn-sm mt-2 variant-filled-primary" on:click={onCropClick}>
			<Icon icon="mdi:camera" class="mr-2" />
			looks good !
		</button>
	</div>
</div>
