<script lang="ts">
	import { apiSignIn } from '$lib/api/auth';
	import Icon from '@iconify/svelte';
	import { ProgressBar, getToastStore } from '@skeletonlabs/skeleton';
	import { createMutation } from '@tanstack/svelte-query';

	export let emailAddress: string;

	const toastStore = getToastStore();

	// TODO:
	const mutation = createMutation({
		mutationFn: () => apiSignIn(1 as any),
		onSuccess: (res) => {
			// TODO: success toast and success message on component with dismiss button
		},
		onError: () => {
			// TODO: error toast and error message on component with dismiss button
			// toastStore.trigger(genericError)
		}
	});
</script>

<!-- TODO: mehh this sucks, start over -->
<div class="btn-group variant-filled-warning">
	email address not verified
	<button>verify email</button>
</div>

<!-- TODO: duplicated logic and change success class -->
<button type="button" class="btn variant-filled-warning px-2 py-1">
	{#if $mutation.isLoading}
		<div class="flex mr-2 items-center">
			<Icon icon="mdi:warning" class="mr-2" />
			sending email
		</div>

		<ProgressBar class="w-28" />
	{:else if $mutation.isSuccess}
		<div class="flex mr-2 items-center">
			<Icon icon="mdi:warning" class="mr-2" />
			email address not verified
		</div>

		<span>verify email</span>
	{:else}
		<div class="flex items-center">
			<Icon icon="mdi:warning" class="mr-2" />
			email address not verified - verify email
		</div>
	{/if}
</button>
