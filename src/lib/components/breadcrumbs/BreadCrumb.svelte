<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		text?: string;
		href?: string;
		icon?: string;
		textColor?: string;
		linkTextColor?: string;
	}

	let {
		text = '',
		href = '',
		icon = '',
		textColor = 'text-secondary-300-700',
		linkTextColor = 'text-secondary-400-600'
	}: Props = $props();
</script>

<li class="type-scale-4 text-nowrap">
	{#if href}
		<a class={`flex items-center anchor no-underline ${linkTextColor}`} {href}>
			{#if icon}
				<Icon {icon} class="mr-2" />
			{/if}

			{text}
		</a>
	{:else}
		<span class={textColor}>
			{text}
		</span>
	{/if}
</li>
