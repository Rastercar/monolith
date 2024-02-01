<script lang="ts">
	import Icon from '@iconify/svelte';

	export let isLoading = false;
	export let canSubmit = false;

	let clazz: string = '';
	export { clazz as class };
</script>

<div class={`flex justify-end ${clazz}`}>
	<button class="btn variant-filled" disabled={!canSubmit || isLoading} on:click>
		{#if !canSubmit}
			<Icon icon="mdi:lock" class="mr-2" />
		{:else if isLoading}
			<Icon icon="mdi:loading" class="mr-2 animate-spin" />
		{/if}

		Next <Icon icon="mdi:arrow-right" class="ml-2" />
	</button>
</div>
