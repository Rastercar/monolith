<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		classes?: string;
		isLoading: boolean;
		disabled?: boolean;
		contentWrapperClass?: string;
		children: Snippet;
		onclick?: () => void;
	}

	const {
		onclick,
		children,
		isLoading,
		classes = '',
		disabled = false,
		contentWrapperClass = '!mx-0'
	}: Props = $props();
</script>

<button class={`${classes} relative`} disabled={isLoading || disabled} {onclick}>
	<div
		class:invisible={!isLoading}
		class="absolute top-0 left-0 w-full h-full flex align-middle justify-center items-center"
	>
		<Progress value={null} classes="mx-2" />
	</div>

	<div class:invisible={isLoading} class={contentWrapperClass}>
		{@render children()}
	</div>
</button>
