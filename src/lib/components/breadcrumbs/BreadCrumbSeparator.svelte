<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

{#if children}{@render children()}{:else}
	<li class="crumb-separator" aria-hidden="true">/</li>
{/if}
