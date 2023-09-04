<script lang="ts">
	import { browser } from '$app/environment';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { Toast, initializeStores, storePopup } from '@skeletonlabs/skeleton';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import '../app.postcss';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { enabled: browser }
		}
	});

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<QueryClientProvider client={queryClient}>
	<Toast />

	<slot />
</QueryClientProvider>
