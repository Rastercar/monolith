<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		onclick: () => void;
		isLoading?: boolean;
		canSubmit?: boolean;
		nextLabel?: string;
		extraClasses?: string;
	}

	let {
		onclick,
		isLoading = false,
		canSubmit = false,
		nextLabel = 'Next',
		extraClasses = ''
	}: Props = $props();
</script>

<div class={`flex justify-end ${extraClasses}`}>
	<button class="btn preset-filled-primary-500" disabled={!canSubmit || isLoading} {onclick}>
		{#if !canSubmit}
			<Icon icon="mdi:lock" />
		{:else if isLoading}
			<Icon icon="mdi:loading" class="animate-spin" />
		{/if}

		{nextLabel}
		<Icon icon="mdi:arrow-right" class="ml-2" />
	</button>
</div>
