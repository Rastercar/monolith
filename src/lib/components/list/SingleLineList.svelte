<script lang="ts">
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';

	interface Item {
		id: string;
		icon: string;
		text: string;
	}

	export let items: Item[];

	const dispatch = createEventDispatcher<{ 'item-clicked': string }>();
</script>

<div class="card text-sm shadow-xl py-2 !z-50" {...$$restProps}>
	{#each items as { id, icon, text }}
		<button
			class="flex items-center hover:bg-surface-400-500-token px-4 py-2 w-full"
			on:click={() => dispatch('item-clicked', id)}
		>
			<Icon {icon} class="mr-2" height={18} />{text}
		</button>
	{/each}
</div>
