<script lang="ts">
	export let colspan = 1;

	export let isLoading = false;

	export let loadingText = 'loading';
	export let noItemsText = 'no items found';
</script>

<tr>
	<th class="p-4" {colspan}>
		{isLoading ? loadingText : noItemsText}
	</th>
</tr>
