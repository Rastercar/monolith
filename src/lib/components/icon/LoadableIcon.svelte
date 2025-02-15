<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { ComponentProps } from 'svelte';

	interface Props extends ComponentProps<Icon> {
		isLoading: boolean;
	}

	const { isLoading, ...iconProps }: Props = $props();
</script>

<Icon
	{...iconProps}
	icon={isLoading ? 'mdi:loading' : iconProps.icon}
	class={`${isLoading ? 'animate-spin' : ''}`}
/>
