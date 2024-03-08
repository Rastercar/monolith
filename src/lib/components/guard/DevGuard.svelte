<script lang="ts">
	import { PUBLIC_IS_DEV } from '$env/static/public';
</script>

<!--
@component
A Guard that only renders the default slot if in development mode
-->
{#if PUBLIC_IS_DEV === 'true'}
	<slot />
{/if}
