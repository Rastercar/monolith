<script lang="ts">
	import { getLayoutContext } from '$lib/store/context';
	import Icon from '@iconify/svelte';

	const layout = getLayoutContext();
</script>

<button class="lg:hidden btn btn-sm mr-4" onclick={() => (layout.drawerOpen = !layout.drawerOpen)}>
	<Icon icon="mdi:menu" class="w-8 h-8" />
</button>
