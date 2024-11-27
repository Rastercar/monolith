<script lang="ts">
	import { getLayoutContext } from '$lib/store/layout.svelte';
	import type { PropsWithClasses } from '$lib/utils/svelte';
	import Icon from '@iconify/svelte';
	import { Switch } from '@skeletonlabs/skeleton-svelte';

	const { classes }: PropsWithClasses = $props();

	const layout = getLayoutContext();
</script>

<Switch name="mode" controlInactive="bg-surface-800" bind:checked={layout.darkMode} {classes}>
	{#snippet inactiveChild()}<Icon icon="mdi:white-balance-sunny" />{/snippet}
	{#snippet activeChild()}<Icon icon="mdi:moon-and-stars" />{/snippet}
</Switch>
