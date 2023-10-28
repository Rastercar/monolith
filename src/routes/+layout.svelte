<script lang="ts">
	import { browser } from '$app/environment';
	import { beforeNavigate } from '$app/navigation';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { Modal, Toast, initializeStores, storePopup } from '@skeletonlabs/skeleton';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import '../app.postcss';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { enabled: browser }
		}
	});

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	// TODO: check route permissions here ?
	beforeNavigate((a) => {
		console.log(a);
	});
</script>

<QueryClientProvider client={queryClient}>
	<Toast />

	<Modal />

	<slot />
</QueryClientProvider>
