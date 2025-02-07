<script lang="ts">
	import { navigating } from '$app/state';
	import { Progress } from '@skeletonlabs/skeleton-svelte';
</script>

{#if navigating.to}
	<Progress value={null} classes="absolute top-0 h-[3px]" meterBg="bg-primary-500" />
{/if}
