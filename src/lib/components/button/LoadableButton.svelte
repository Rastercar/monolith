<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	export let isLoading: boolean;

	let clazz: string = '';
	export { clazz as class };
</script>

<button class={clazz} disabled={isLoading} on:click>
	{#if isLoading}
		<ProgressRadial value={undefined} width="w-6" />
	{:else}
		<slot />
	{/if}
</button>
