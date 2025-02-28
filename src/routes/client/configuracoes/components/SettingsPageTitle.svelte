<script lang="ts">
	import type { PropsWithChildren } from '$lib/utils/svelte';

	let { children }: PropsWithChildren = $props();
</script>

<h1 class="h1 mb-3">{@render children()}</h1>
