<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		text?: string;
		href?: string;
		icon?: string;
		textColor?: string;
	}

	let {
		text = '',
		href = '',
		icon = '',
		textColor = 'text-primary-700-200-token'
	}: Props = $props();

	let linkClasses = $derived(`flex items-center anchor no-underline ${textColor}`);
</script>

<li class="type-scale-2">
	{#if href}
		<a class={linkClasses} {href}>
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
