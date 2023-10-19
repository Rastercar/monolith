<script lang="ts">
	import Cropper from 'svelte-easy-crop';
	import type { CropArea, DispatchEvents, Point } from 'svelte-easy-crop/types';

	let crop: Point = { x: 0, y: 0 };

	let fileinput: HTMLInputElement;
	let pixelCrop: CropArea | null = null;

	let image: string | null = null;
	let croppedImage: string | null = null;

	const createImage = (url: string): Promise<HTMLImageElement> => {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.addEventListener('load', () => resolve(image));
			image.addEventListener('error', (error) => reject(error));
			image.src = url;
		});
	};

	const getCroppedImg = async () => {
		if (!image || !pixelCrop) return;

		const imgElement = await createImage(image);
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		if (!ctx) throw new Error('cannot get cropper canvas');

		// set canvas size to match the bounding box
		canvas.width = imgElement.width;
		canvas.height = imgElement.height;

		ctx.drawImage(imgElement, 0, 0);

		// croppedAreaPixels values are bounding box relative
		// extract the cropped image using these values
		const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

		// set canvas width to final desired crop size - this will clear existing context
		canvas.width = pixelCrop.width;
		canvas.height = pixelCrop.height;

		// paste generated image at the top left corner
		ctx.putImageData(data, 0, 0);

		canvas.toBlob((file) => {
			croppedImage = file ? URL.createObjectURL(file) : null;
		}, 'image/jpeg');
	};

	const loadImage = (file: File) => {
		let reader = new FileReader();

		reader.onload = () => {
			if (typeof reader.result === 'string') image = reader.result;
		};

		reader.readAsDataURL(file);
	};

	const onFileSelected = (e: Event) => {
		let target = e.target as HTMLInputElement;
		const file = target?.files?.[0];

		if (file) loadImage(file);
	};

	const previewCrop = (e: CustomEvent<DispatchEvents['cropcomplete']>) => {
		pixelCrop = e.detail.pixels;
	};

	const clearImages = () => {
		image = null;
		croppedImage = null;
	};
</script>

{#if !image}
	<input
		type="file"
		accept=".jpg, .jpeg, .png, .webp"
		on:change={onFileSelected}
		bind:this={fileinput}
	/>
{:else}
	<div class="w-full h-[300px] relative" class:hidden={croppedImage}>
		<Cropper {image} {crop} zoom={1} on:cropcomplete={previewCrop} aspect={1} cropShape="round" />
	</div>

	{#if croppedImage}
		<img src={croppedImage} alt="Cropped profile" />
		<button type="button" on:click={clearImages}>Start over?</button>
	{:else}
		<button type="button" on:click={getCroppedImg}> Crop! </button>
	{/if}
{/if}
