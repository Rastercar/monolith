<script lang="ts" generics="T">
	import type { Table } from '@tanstack/svelte-table';
	import type { Readable } from 'svelte/store';
	import TableBody from './TableBody.svelte';
	import TableHeader from './TableHeader.svelte';

	export let table: Readable<Table<T>>;
	export let colspan: number;
	export let isLoading: boolean;

	export let width = 'w-full';
	export let borderColor = 'border-surface-400-500-token';

	export let overflowX = 'overflow-x-scroll';

	let clazz = '';
	export { clazz as class };
</script>

<div class={`${clazz} ${overflowX}`}>
	<table class={`${borderColor} ${width}`}>
		<TableHeader {isLoading} {table} {colspan} {borderColor} />

		<TableBody {isLoading} {table} {colspan} {borderColor} />
	</table>
</div>
