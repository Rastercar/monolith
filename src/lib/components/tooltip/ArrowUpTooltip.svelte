<script lang="ts">
	interface Props {
		padding?: string;
		bgColor?: string;
		additionalClasses?: string;
		dataPopup: string;
		children?: import('svelte').Snippet;
	}

	let {
		padding = 'p-2',
		bgColor = 'bg-surface-200-800',
		additionalClasses = '',
		dataPopup,
		children
	}: Props = $props();
</script>

<!-- TODO: remove me ! -->
<div class={`card ${padding} ${bgColor} ${additionalClasses} z-20`} data-popup={dataPopup}>
	{@render children?.()}
	<div class={`arrow ${bgColor}`}></div>
</div>
