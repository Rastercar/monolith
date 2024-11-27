<script lang="ts">
	import { browser } from '$app/environment';
	import { setAuthContext } from '$lib/store/auth.svelte';
	import { setLayoutContext } from '$lib/store/layout.svelte';
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
	onMount(() => (mounted = true));
</script>

<QueryClientProvider client={queryClient}>
	<SvelteToast />

	<!-- 
		if we dont wait for the component to mount it will use the default theme and later
		load the theme from the local storage causing a very annoying flicker
	-->
	{#if mounted}
		{@render children()}
	{/if}
</QueryClientProvider>
