<script lang="ts">
	// [PROD-TODO] remove this page
	import { getToaster } from '$lib/store/toaster';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import Navigation from './components/Navigation.svelte';

	const xdStore = getToaster();
</script>

<div class="h-full flex items-center justify-center">
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
</div>
