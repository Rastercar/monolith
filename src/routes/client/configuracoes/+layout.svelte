<script lang="ts">
	import type { PropsWithChildren } from '$lib/utils/svelte';

	let { children }: PropsWithChildren = $props();
</script>

<div class="p-6 max-w-3xl mx-auto">
	{@render children()}
</div>
