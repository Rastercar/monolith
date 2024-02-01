<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';

	export let colspan = 1;

	export let isLoading = false;

	export let borderX = 'border-x-2';
	export let borderTop = 'border-t-2';
	export let borderColor = 'border-surface-400-500-token';

	$: clazz = `${borderX} ${borderTop} ${borderColor}`;
</script>

<tr class={clazz}>
	<th {colspan} class="p-0">
		<ProgressBar value={isLoading ? undefined : 0} rounded="rounded-none" height="h-1" />
	</th>
</tr>
