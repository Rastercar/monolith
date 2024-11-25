<script lang="ts">
	import { getLayoutContext } from '$lib/store/layout.svelte';
	import Icon from '@iconify/svelte';

	const layoutContext = getLayoutContext();
</script>

<button class="lg:hidden btn btn-sm mr-4" onclick={layoutContext.toggleDrawer}>
	<Icon icon="mdi:menu" class="w-8 h-8" />
</button>
