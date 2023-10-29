<script lang="ts">
	import { apiConfirmUserEmailAddressByToken } from '$lib/api/auth';
	import { apiConfirmOrgEmailAddressByToken } from '$lib/api/organization';
	import { isApiErrorObject } from '$lib/api/utils';
	import { authStore } from '$lib/store/auth';
	import { awaitPromiseWithMinimumTimeOf } from '$lib/utils/promises';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { createMutation } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import { WretchError } from 'wretch/resolver';
	import type { PageData } from './$types';

	export let data: PageData;

	let errorCause = 'error verifying your email address';

	const mutation = createMutation({
		mutationFn: () => {
			const requestPromise = data.confirmingForOrg
				? apiConfirmOrgEmailAddressByToken(data.confirmEmailToken)
				: apiConfirmUserEmailAddressByToken(data.confirmEmailToken);

			return awaitPromiseWithMinimumTimeOf(requestPromise, 1_500);
		},

		onError: (e) => {
			if (!(e instanceof WretchError) || !isApiErrorObject(e.json)) return;
			if (e.status === 404 || e.status === 401) {
				errorCause = 'failed to verify email address, invalid verification token';
			}
		},

		onSuccess: authStore.setUserEmailAsVerified
	});

	onMount(() => $mutation.mutate());
</script>

<div class="h-full flex justify-center pt-12">
	<div>
		{#if $mutation.isLoading}
			<h1 class="mb-1 text-center text-xl text-secondary-500-400-token">
				confirming your email address
			</h1>
			<ProgressBar class="mt-4" />
		{:else if $mutation.isSuccess}
			<h1 class="mb-1 text-center text-xl text-success-500-400-token">
				{data.confirmingForOrg
					? 'organization billing email address confirmed'
					: 'email address confirmed'}
			</h1>

			<a href="/client" class="text-primary-700-200-token underline-offset-4 hover:underline">
				go to home page
			</a>
		{:else if $mutation.isError}
			<h1 class="mb-1 text-center text-xl text-error-500-400-token">
				{errorCause}
			</h1>

			<a href="/client" class="text-primary-700-200-token underline-offset-4 hover:underline">
				go to home page
			</a>
		{/if}
	</div>
</div>
