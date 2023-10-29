<script lang="ts">
	import { apiRequestEmailAddressConfirmationEmail } from '$lib/api/user';
	import { awaitPromiseWithMinimumDelay } from '$lib/utils/promises';
	import Icon from '@iconify/svelte';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { createMutation } from '@tanstack/svelte-query';

	const mutation = createMutation({
		mutationFn: () => awaitPromiseWithMinimumDelay(apiRequestEmailAddressConfirmationEmail(), 1_500)
	});

	// TODO: change this component name

	let dismissed = false;
</script>

<div class="max-w-xs flex items-center space-x-2 text-sm" class:hidden={dismissed}>
	{#if $mutation.isLoading}
		<div class="text-secondary-500-400-token">
			sending confirmation email
			<ProgressBar class="mt-1" />
		</div>
	{:else if $mutation.isSuccess}
		<span class="text-success-500-400-token flex items-center">
			confirmation email sent to your inbox

			<button type="button" class="btn-icon btn-icon-sm" on:click={() => (dismissed = true)}>
				<Icon icon="mdi:close" />
			</button>
		</span>
	{:else if $mutation.isError}
		<span class="text-error-500-400-token flex items-center">
			<Icon icon="mdi:error" class="mr-2" />
			error verifying your email address

			<button type="button" class="btn-icon btn-icon-sm" on:click={() => (dismissed = true)}>
				<Icon icon="mdi:close" />
			</button>
		</span>
	{:else}
		<button
			type="button"
			class="btn btn-sm variant-filled-warning py-1"
			on:click={() => $mutation.mutate()}
		>
			verify email
		</button>
	{/if}
</div>
