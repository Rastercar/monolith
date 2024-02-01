<script lang="ts" generics="T">
	import { flexRender, type Table } from '@tanstack/svelte-table';
	import type { Readable } from 'svelte/store';
	import EmptyTableBodyPlaceholder from './EmptyTableBodyPlaceholder.svelte';

	export let table: Readable<Table<T>>;
	export let colspan: number;
	export let isLoading: boolean;

	export let borderColor = 'border-surface-400-500-token';
</script>

<tbody class={`border-x-2 border-b-2 ${borderColor}`}>
	{#each $table.getRowModel().rows as row}
		<tr class={`border-b-2 ${borderColor} hover:bg-surface-100-800-token`}>
			{#each row.getVisibleCells() as cell}
				<td class="p-4">
					<svelte:component this={flexRender(cell.column.columnDef.cell, cell.getContext())} />
				</td>
			{/each}
		</tr>
	{:else}
		<EmptyTableBodyPlaceholder {colspan} {isLoading} />
	{/each}
</tbody>
