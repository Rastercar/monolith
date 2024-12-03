<script lang="ts">
	import { Pagination } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		page: number;
		pageSize: number;
		count: number;
		data: unknown[];
		extraClasses?: string;
	}

	let {
		data,
		count,
		page = $bindable(),
		pageSize = $bindable(),
		extraClasses = ''
	}: Props = $props();
</script>

<div class={`flex-col-reverse sm:flex-row flex justify-between gap-4 ${extraClasses}`}>
	<select name="size" id="size" class="select max-w-full sm:max-w-[150px]" bind:value={pageSize}>
		{#each [3, 5, 10] as v}
			<option value={v}>{v} Items</option>
		{/each}
	</select>

	<!-- hack until: https://github.com/skeletonlabs/skeleton/issues/2986 is fixed -->
	{#key count}
		<Pagination bind:page bind:pageSize {data} {count} />
	{/key}
</div>
