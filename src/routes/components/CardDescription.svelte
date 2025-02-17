<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();
</script>

<p class="opacity-80 type-scale-1 mb-2">
	{@render children()}
</p>
