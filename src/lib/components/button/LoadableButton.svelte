<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props {
		classes?: string;
		isLoading: boolean;
		disabled?: boolean;
		contentWrapperClass?: string;
		type?: HTMLButtonAttributes['type'];
		children: Snippet;
		onclick?: () => void;
	}

	const {
		type,
		onclick,
		children,
		isLoading,
		classes = '',
		disabled = false,
		contentWrapperClass = '!mx-0'
	}: Props = $props();
</script>

<button class={`${classes} relative`} {type} disabled={isLoading || disabled} {onclick}>
	<div
		class:invisible={!isLoading}
		class="absolute top-0 left-0 w-full h-full flex align-middle justify-center items-center"
	>
		<Progress value={null} classes="mx-4" />
	</div>

	<div class:invisible={isLoading} class={contentWrapperClass}>
		{@render children()}
	</div>
</button>
