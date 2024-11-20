<script lang="ts">
	import Icon from '@iconify/svelte';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	const drawerStore = getDrawerStore();
</script>

<button class="lg:hidden btn btn-sm mr-4" onclick={() => drawerStore.open({})}>
	<Icon icon="mdi:menu" class="fill-token w-8 h-8" />
</button>
