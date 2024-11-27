<script lang="ts">
	import { env } from '$lib/env/public-env';

	interface Props {
		children?: import('svelte').Snippet;
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
