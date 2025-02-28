<script lang="ts">
	import { apiConfirmEmailAddressMutation } from '$lib/api/auth.queries.js';
	import { route } from '$lib/ROUTES';
	import { getAuthContext } from '$lib/store/context';
	import { Progress } from '@skeletonlabs/skeleton-svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	const { confirmingForOrg, token } = data;

	const authContext = getAuthContext();

	const mutation = apiConfirmEmailAddressMutation({
		onSuccess: () => authContext.setUserEmailAsVerified()
	});

	onMount(() => mutation.mutate({ confirmingForOrg, token }));
</script>

{#snippet homePageLink()}
	<a href={route('/client')} class="text-primary-700-200-token underline-offset-4 hover:underline">
		ir a página principal
	</a>
{/snippet}

<div class="h-full flex justify-center pt-12">
	<div>
		{#if mutation.isPending}
			<h1 class="mb-1 text-center text-xl text-secondary-600-400">
				confirmando seu endereço de email
			</h1>
			<Progress value={null} classes="mt-4" />
		{:else if mutation.isSuccess}
			<h1 class="mb-1 text-center text-xl text-success-600-400">
				{data.confirmingForOrg
					? 'endereço de email de cobrança da organização confirmado'
					: 'endereço de email confirmado'}
			</h1>

			{@render homePageLink()}
		{:else if mutation.isError}
			<h1 class="mb-1 text-center text-xl text-error-600-400">
				erro ao confirmar seu endereço de email
			</h1>

			{@render homePageLink()}
		{/if}
	</div>
</div>
