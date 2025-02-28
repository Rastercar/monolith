<script lang="ts">
	import Icon from '@iconify/svelte';
	import Cropper from 'svelte-easy-crop';

	interface Point {
		x: number;
		y: number;
	}

	interface CropArea {
		x: number;
		y: number;
		width: number;
		height: number;
	}

	interface Props {
		onClose: VoidFunction;
		onImageCropped: (_: Blob) => void;
		image?: string | null;
	}

	let { image, onImageCropped, onClose }: Props = $props();

	let crop: Point = { x: 0, y: 0 };

	let pixelCrop: CropArea | null = null;

	let isCropping = false;

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

	const close = () => {
		image = null;
		onClose();
	};

	const onCropClick = async () => {
		isCropping = true;

		const croppedImg = await getCroppedImg().finally(() => {
			isCropping = false;
		});

		if (croppedImg) onImageCropped(croppedImg);
	};
</script>

<div class="bg-surface-500">
	<div class="flex justify-end p-2">
		<button
			type="button"
			class="btn btn-icon preset-filled-warning-300-700"
			onclick={() => close()}
		>
			<Icon icon="mdi:close" />
		</button>
	</div>

	<div class="w-full h-[500px] relative">
		{#if image}
			<Cropper
				{image}
				{crop}
				zoom={1}
				aspect={1}
				cropShape="round"
				on:cropcomplete={({ detail }) => {
					pixelCrop = detail.pixels;
				}}
			/>
		{/if}
	</div>

	<div class="flex justify-end p-4">
		<button type="button" class="btn preset-filled-primary-300-700" onclick={onCropClick}>
			<Icon icon="mdi:camera" />
			parece bom !
		</button>
	</div>
</div>
