<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		icon: string;
		title: string;
		colSpan?: string;
		rowSpan?: string;
		topBorderColor: string;
		children: Snippet;
	}

	const {
		children,
		icon,
		title,
		topBorderColor,
		rowSpan = 'row-span-1',
		colSpan = 'sm:col-span-1 col-span-2'
	}: Props = $props();
</script>

<div
	class={`card preset-filled-surface-100-900 p-4 ${colSpan} ${rowSpan} border-2 border-transparent border-t-2 ${topBorderColor}`}
>
	<div class="flex flex-col h-full">
		<div class="flex items-center mb-2">
			<Icon {icon} height={32} class="mr-2" />
			<span class="type-scale-3">{title}</span>
		</div>

		{@render children()}
	</div>
</div>
