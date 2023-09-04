<script>
	// TODO: rm me !
	import { apiGetCurrentUser } from '$lib/api/auth';
	import Navigation from '$lib/components/navigation/Navigation.svelte';
	import { LightSwitch } from '@skeletonlabs/skeleton';
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
			<!-- TODO: rm me! -->
			<button class="btn variant-filled" on:click={() => apiGetCurrentUser().then(console.log)}>
				apiGetCurrentUser
			</button>
		</div>
	</div>
</div>
