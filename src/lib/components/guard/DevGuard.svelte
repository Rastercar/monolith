<script lang="ts">
	import { env } from '$lib/env/public-env';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<!--
@component
A Guard that only renders the default slot if in development mode
-->
{#if env.PUBLIC_IS_DEV}
	{@render children?.()}
{/if}
