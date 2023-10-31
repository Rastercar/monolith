<script lang="ts">
	// [PROD-TODO] remove all pages under the dev folder
	import { getToaster } from '$lib/store/toaster';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import Navigation from './components/Navigation.svelte';

	const xdStore = getToaster();

	let a = 0;
	let b = 0;
	let total = 0;

	async function add() {
		const response = await fetch('/dev', {
			method: 'POST',
			body: JSON.stringify({ a, b }),
			headers: { 'content-type': 'application/json' }
		});

		total = await response.json();
	}
</script>

<div class="h-full flex items-center justify-center space-x-4">
	<div class="w-96 border-2 border-surface-300-600-token">
		<div class="flex justify-between p-4">
			<span>home page</span>
			<LightSwitch />
		</div>

		<Navigation class="mt-4" />

		<div class="border-t-2 border-surface-300-600-token" />

		<div class="flex justify-center p-4">
			<button class="btn variant-filled" on:click={() => xdStore.error()}> toast test </button>
		</div>
	</div>

	<div class="card p-4">
		<input type="number" class="input" bind:value={a} /> +
		<input type="number" class="input" bind:value={b} /> =
		{total}

		<button on:click={add}>Calculate</button>
	</div>
</div>
