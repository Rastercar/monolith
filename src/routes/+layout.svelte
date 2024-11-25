<script lang="ts">
	import { browser } from '$app/environment';
	import { setAuthContext } from '$lib/store/auth.svelte';
	import { setLayoutContext } from '$lib/store/layout.svelte';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import type { Snippet } from 'svelte';
	import '../app.postcss';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { enabled: browser }
		}
	});

	setAuthContext();
	setLayoutContext();

	const { children }: { children: Snippet } = $props();
</script>

<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>
