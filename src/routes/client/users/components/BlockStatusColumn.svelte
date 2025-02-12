<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		isBlocked: boolean;
	}

	const { isBlocked }: Props = $props();
</script>

<div class="flex items-center space-x-4">
	<Icon
		icon={isBlocked ? 'mdi:denied' : 'mdi:check'}
		class={`${isBlocked ? 'text-error-200-800' : 'text-success-200-800'} mr-2`}
	/>
	{isBlocked ? 'blocked' : 'not blocked'}
</div>
