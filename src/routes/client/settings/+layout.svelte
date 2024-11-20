<script>
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<!-- default container style for all settings pages, if a page wont use this, we can move all pages to a (centralized-layout) folder with this layout -->
<div class="p-6 max-w-3xl mx-auto">
	{@render children?.()}
</div>
