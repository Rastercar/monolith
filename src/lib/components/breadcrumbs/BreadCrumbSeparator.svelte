<script lang="ts">
	let { children } = $props();
</script>

{#if children}{@render children()}{:else}
	<li class="crumb-separator">/</li>
{/if}
