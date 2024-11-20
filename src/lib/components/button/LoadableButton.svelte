<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		className?: string;
		isLoading: boolean;
		disabled?: boolean;
		loaderWidth?: string;
		contentWrapperClasses?: string;
		children: Snippet;
		onclick: () => void;
	}

	const {
		onclick,
		children,
		className = '',
		isLoading,
		disabled = false,
		loaderWidth = 'w-6',
		contentWrapperClasses = '!mx-0'
	}: Props = $props();
</script>

<button class={`${className} relative`} disabled={isLoading || disabled} {onclick}>
	<div
		class:invisible={!isLoading}
		class="absolute top-0 left-0 w-full h-full flex align-middle justify-center items-center"
	>
		<Progress value={null} classes="mx-2" />
	</div>

	<div class:invisible={isLoading} class={contentWrapperClasses}>
		{@render children()}
	</div>
</button>
