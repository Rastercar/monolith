<script lang="ts">
	import Icon from '@iconify/svelte';

	export let text: string | undefined = '';
	export let href: string | undefined = '';
	export let icon: string | undefined = '';

	export let textColor = 'text-primary-700-200-token';

	$: linkClasses = `flex items-center anchor no-underline ${textColor}`;
</script>

<li class="crumb text-lg">
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
