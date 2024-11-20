<script lang="ts" generics="T">
	import { flexRender, type Table } from '@tanstack/svelte-table';
	import type { Readable } from 'svelte/store';
	import EmptyTableBodyPlaceholder from './EmptyTableBodyPlaceholder.svelte';


	interface Props {
		table: Readable<Table<T>>;
		colspan: number;
		isLoading: boolean;
		borderColor?: string;
	}

	let {
		table,
		colspan,
		isLoading,
		borderColor = 'border-surface-400-500-token'
	}: Props = $props();
</script>

<tbody class={`border-x-2 border-b-2 ${borderColor}`}>
	{#each $table.getRowModel().rows as row}
		<tr class={`border-b-2 ${borderColor} hover:bg-surface-100-800-token`}>
			{#each row.getVisibleCells() as cell}
				{@const SvelteComponent = flexRender(cell.column.columnDef.cell, cell.getContext())}
				<td class="p-4">
					<SvelteComponent />
				</td>
			{/each}
		</tr>
	{:else}
		<EmptyTableBodyPlaceholder {colspan} {isLoading} />
	{/each}
</tbody>
