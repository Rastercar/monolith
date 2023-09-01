<script lang="ts">
	import { browser } from '$app/environment';
	import { authStore } from '$lib/store/auth';
	import { Toast, initializeStores } from '@skeletonlabs/skeleton';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import '../app.postcss';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { enabled: browser }
		}
	});

	initializeStores();
</script>

{$authStore.user}

<QueryClientProvider client={queryClient}>
	<Toast />

	<slot />
</QueryClientProvider>
