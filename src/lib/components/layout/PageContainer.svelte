<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		p?: string;
		mx?: string;
		maxW?: string;
		extraClasses?: string;
		children: Snippet;
	}

	const {
		children,
		p = 'p-6',
		maxW = 'max-w-5xl',
		mx = 'mx-auto',
		extraClasses = ''
	}: Props = $props();
</script>

<div class={`${p} ${maxW} ${mx} ${extraClasses}`}>
	{@render children()}
</div>
