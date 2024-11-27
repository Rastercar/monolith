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
	const layout = setLayoutContext();

	let isLoadingTheme = $state(true);

	onMount(() => {
		if (!layout.selectedTheme) {
			const theme = document.body.getAttribute('data-theme') ?? 'rastercar';
			layout.selectedTheme = theme;
		} else {
			document.body.setAttribute('data-theme', layout.selectedTheme);
		}

		isLoadingTheme = false;
	});
</script>

<QueryClientProvider client={queryClient}>
	<SvelteToast />

	{#if !isLoadingTheme}
		{@render children()}
	{/if}
</QueryClientProvider>
