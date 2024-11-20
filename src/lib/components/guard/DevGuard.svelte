<script lang="ts">
	import { PUBLIC_IS_DEV } from '$env/static/public';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<!--
@component
A Guard that only renders the default slot if in development mode
-->
{#if PUBLIC_IS_DEV === 'true'}
	{@render children?.()}
{/if}
