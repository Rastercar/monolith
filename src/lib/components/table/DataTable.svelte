<script lang="ts" generics="T">
	import type { Table } from '@tanstack/svelte-table';
	import type { Readable } from 'svelte/store';
	import TableBody from './TableBody.svelte';
	import TableHeader from './TableHeader.svelte';

	interface Props {
		table: Readable<Table<T>>;
		isLoading: boolean;
		classes?: string;
		width?: string;
		overflowX?: string;
		borderColor?: string;
	}

	let {
		table,
		isLoading,
		width = 'w-full',
		classes = '',
		overflowX = 'overflow-x-auto',
		borderColor = 'border-surface-400-600'
	}: Props = $props();
</script>

<div class={`${classes} ${overflowX}`}>
	<table class={`${borderColor} ${width}`}>
		<TableHeader {isLoading} {table} {borderColor} />

		<TableBody {isLoading} {table} {borderColor} />
	</table>
</div>
