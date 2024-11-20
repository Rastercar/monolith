<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import Icon from '@iconify/svelte';


	interface Props {
		isLoading?: boolean;
		canSubmit?: boolean;
		nextLabel?: string;
		class?: string;
	}

	let {
		isLoading = false,
		canSubmit = false,
		nextLabel = 'Next',
		class: clazz = ''
	}: Props = $props();
	
</script>

<div class={`flex justify-end ${clazz}`}>
	<button class="btn variant-filled" disabled={!canSubmit || isLoading} onclick={bubble('click')}>
		{#if !canSubmit}
			<Icon icon="mdi:lock" class="mr-2" />
		{:else if isLoading}
			<Icon icon="mdi:loading" class="mr-2 animate-spin" />
		{/if}

		{nextLabel}
		<Icon icon="mdi:arrow-right" class="ml-2" />
	</button>
</div>
