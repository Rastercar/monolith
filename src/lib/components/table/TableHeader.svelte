<script lang="ts" generics="T">
	import { flexRender, type Table } from '@tanstack/svelte-table';
	import type { Readable } from 'svelte/store';
	import TableRowLoader from './TableRowLoader.svelte';

	export let table: Readable<Table<T>>;
	export let colspan: number;
	export let isLoading: boolean;

	export let borderColor = 'border-surface-400-500-token';
</script>

<thead>
	{#each $table.getHeaderGroups() as headerGroup}
		<tr class={`border-t-2 ${borderColor}`}>
			{#each headerGroup.headers as header}
				<th class={`p-3 border-x-2 ${borderColor}`}>
					{#if !header.isPlaceholder}
						<svelte:component
							this={flexRender(header.column.columnDef.header, header.getContext())}
						/>
					{/if}
				</th>
			{/each}
		</tr>

		<TableRowLoader {colspan} {isLoading} {borderColor} />
	{/each}
</thead>
