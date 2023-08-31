<script lang="ts">
	import { browser } from '$app/environment';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import '../app.postcss';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { enabled: browser }
		}
	});

	initializeStores();
</script>

<QueryClientProvider client={queryClient}>
	<slot />
</QueryClientProvider>
