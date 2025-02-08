<script lang="ts">
	import { Pagination } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		page: number;
		pageSize: number;
		count: number;
		data: unknown[];
		extraClasses?: string;
		withPageSizeSelector?: boolean;
		alternativePagination?: boolean;
	}

	let {
		data,
		count,
		page = $bindable(),
		pageSize = $bindable(),
		extraClasses = '',
		withPageSizeSelector = true,
		alternativePagination = $bindable()
	}: Props = $props();
</script>

<div class={`flex-col-reverse sm:flex-row flex justify-between gap-4 ${extraClasses}`}>
	{#if withPageSizeSelector}
		<select name="size" class="select max-w-full sm:max-w-[150px]" bind:value={pageSize}>
			{#each [3, 5, 10] as v}
				<option value={v}>{v} Items</option>
			{/each}
		</select>
	{/if}

	<Pagination bind:page bind:pageSize {data} {count} alternative={alternativePagination} />
</div>
