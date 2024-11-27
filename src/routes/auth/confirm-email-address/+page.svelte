<script lang="ts">
	import { apiConfirmEmailAddress } from '$lib/api/auth.js';
	import { route } from '$lib/ROUTES.js';
	import { getAuthContext } from '$lib/store/auth.svelte.js';
	import { showApiErrorToast } from '$lib/toast.js';
	import { awaitPromiseWithMinimumTimeOf } from '$lib/utils/promises.js';
	import { Progress } from '@skeletonlabs/skeleton-svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';

	let { data } = $props();
	const { confirmingForOrg, token } = data;

	const authContext = getAuthContext();

	const mutation = createMutation({
		mutationFn: () => {
			const promise = apiConfirmEmailAddress({ confirmingForOrg, token });
			return awaitPromiseWithMinimumTimeOf(promise, 1_500);
		},
		onError: showApiErrorToast,
		onSuccess: () => authContext.setUserEmailAsVerified()
	});

	onMount($mutation.mutate);
</script>

{#snippet homePageLink()}
	<a href={route('/client')} class="text-primary-700-200-token underline-offset-4 hover:underline">
		go to home page
	</a>
{/snippet}

<div class="h-full flex justify-center pt-12">
	<div>
		{#if $mutation.isPending}
			<h1 class="mb-1 text-center text-xl text-secondary-600-400">confirming your email address</h1>
			<Progress value={null} classes="mt-4" />
		{:else if $mutation.isSuccess}
			<h1 class="mb-1 text-center text-xl text-success-600-400">
				{data.confirmingForOrg
					? 'organization billing email address confirmed'
					: 'email address confirmed'}
			</h1>

			{@render homePageLink()}
		{:else if $mutation.isError}
			<h1 class="mb-1 text-center text-xl text-error-600-400">
				error confirming your email address
			</h1>

			{@render homePageLink()}
		{/if}
	</div>
</div>
