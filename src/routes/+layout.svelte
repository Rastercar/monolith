<script lang="ts">
	import { browser } from '$app/environment';
	import PageNavigationLoaderIndicator from '$lib/components/layout/PageNavigationLoaderIndicator.svelte';
	import { setAuthContext, setLayoutContext } from '$lib/store/context';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { onMount, type Snippet } from 'svelte';
	import '../app.postcss';

	const { children }: { children: Snippet } = $props();

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { enabled: browser }
		}
	});

	setAuthContext();
	setLayoutContext();

	let mounted = $state(false);

	onMount(() => {
		window.queryClient = queryClient;
		mounted = true;
	});
</script>

<svelte:head>
	<title>Rastercar</title>
</svelte:head>

<QueryClientProvider client={queryClient}>
	<SvelteToast />

	<!-- 
		if we dont wait for the component to mount it will use the default theme and later
		load the theme from the local storage causing a very annoying flicker
	-->
	{#if mounted}
		<PageNavigationLoaderIndicator />

		{@render children()}
	{/if}
</QueryClientProvider>
