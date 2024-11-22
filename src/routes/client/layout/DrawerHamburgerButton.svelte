<script lang="ts">
	import { navigationDrawerState } from '$lib/store/layout-store.svelte';
	import Icon from '@iconify/svelte';
</script>

<button
	class="lg:hidden btn btn-sm mr-4"
	onclick={() => (navigationDrawerState.open = !navigationDrawerState.open)}
>
	<Icon icon="mdi:menu" class="w-8 h-8" />
</button>
