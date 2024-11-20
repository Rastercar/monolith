<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet | string;
	}

	const { children }: Props = $props();
</script>

{#if typeof children === 'string'}
	{children}
{:else}
	{@render children()}
{/if}
