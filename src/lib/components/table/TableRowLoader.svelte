<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		colspan: number;
		isLoading?: boolean;
		borderX?: string;
		borderTop?: string;
		borderColor?: string;
	}

	let {
		colspan,
		isLoading = false,
		borderX = 'border-x-2',
		borderTop = 'border-t-2',
		borderColor = 'border-surface-400-500-token'
	}: Props = $props();

	let clazz = $derived(`${borderX} ${borderTop} ${borderColor}`);
</script>

<tr class={clazz}>
	<th {colspan} class="p-0">
		<Progress value={isLoading ? null : 0} rounded="rounded-none" height="h-1" />
	</th>
</tr>
