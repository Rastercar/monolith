<script lang="ts" generics="T">
	import { flexRender, type Table } from '@tanstack/svelte-table';
	import type { Readable } from 'svelte/store';
	import TableRowLoader from './TableRowLoader.svelte';


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

<thead>
	{#each $table.getHeaderGroups() as headerGroup}
		<tr class={`border-t-2 ${borderColor}`}>
			{#each headerGroup.headers as header}
				<th class={`p-3 border-x-2 ${borderColor}`}>
					{#if !header.isPlaceholder}
						{@const SvelteComponent = flexRender(header.column.columnDef.header, header.getContext())}
						<SvelteComponent
						/>
					{/if}
				</th>
			{/each}
		</tr>

		<TableRowLoader {colspan} {isLoading} {borderColor} />
	{/each}
</thead>
