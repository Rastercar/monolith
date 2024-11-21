<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';

	let { data } = $props();

	let errorCause = $state('error verifying your email address');

	// TODO:
	// const mutation = createMutation({
	// 	mutationFn: () => {
	// 		const requestPromise = data.confirmingForOrg
	// 			? apiConfirmOrgEmailAddressByToken(data.confirmEmailToken)
	// 			: apiConfirmUserEmailAddressByToken(data.confirmEmailToken);

	// 		return awaitPromiseWithMinimumTimeOf(requestPromise, 1_500);
	// 	},

	// 	onError: (e) => {
	// 		if (!(e instanceof WretchError) || !isApiErrorObject(e.json)) return;
	// 		if (e.status === 404 || e.status === 401) {
	// 			errorCause = 'failed to verify email address, invalid verification token';
	// 		}
	// 	},

	// 	onSuccess: authStore.setUserEmailAsVerified
	// });

	// onMount($mutation.mutate);

	const isPending = false;
	const isSuccess = false;
	const isError = false;
</script>

<div class="h-full flex justify-center pt-12">
	<div>
		{#if isPending}
			<h1 class="mb-1 text-center text-xl text-secondary-500-400-token">
				confirming your email address
			</h1>
			<Progress classes="mt-4" />
		{:else if isSuccess}
			<h1 class="mb-1 text-center text-xl text-success-500-400-token">
				{data.confirmingForOrg
					? 'organization billing email address confirmed'
					: 'email address confirmed'}
			</h1>

			<a href="/client" class="text-primary-700-200-token underline-offset-4 hover:underline">
				go to home page
			</a>
		{:else if isError}
			<h1 class="mb-1 text-center text-xl text-error-500-400-token">
				{errorCause}
			</h1>

			<a href="/client" class="text-primary-700-200-token underline-offset-4 hover:underline">
				go to home page
			</a>
		{/if}
	</div>
</div>
