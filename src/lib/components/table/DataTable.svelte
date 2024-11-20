<script lang="ts" generics="T">
	import type { Table } from '@tanstack/svelte-table';
	import type { Readable } from 'svelte/store';
	import TableBody from './TableBody.svelte';
	import TableHeader from './TableHeader.svelte';




	interface Props {
		table: Readable<Table<T>>;
		colspan: number;
		isLoading: boolean;
		width?: string;
		borderColor?: string;
		overflowX?: string;
		class?: string;
	}

	let {
		table,
		colspan,
		isLoading,
		width = 'w-full',
		borderColor = 'border-surface-400-500-token',
		overflowX = 'overflow-x-scroll',
		class: clazz = ''
	}: Props = $props();
	
</script>

<div class={`${clazz} ${overflowX}`}>
	<table class={`${borderColor} ${width}`}>
		<TableHeader {isLoading} {table} {colspan} {borderColor} />

		<TableBody {isLoading} {table} {colspan} {borderColor} />
	</table>
</div>
