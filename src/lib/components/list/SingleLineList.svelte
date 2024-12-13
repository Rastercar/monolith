<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Item {
		id: string;
		icon: string;
		text: string;
	}

	interface Props {
		items: Item[];
		onItemClick: (_: string) => void;
	}

	let { items, onItemClick }: Props = $props();
</script>

<!-- TODO: will we use this ? -->
<div class="card text-sm shadow-xl py-2 !z-50">
	{#each items as { id, icon, text }}
		<button class="flex items-center px-4 py-2 w-full" onclick={() => onItemClick(id)}>
			<Icon {icon} class="mr-2" height={18} />{text}
		</button>
	{/each}
</div>
