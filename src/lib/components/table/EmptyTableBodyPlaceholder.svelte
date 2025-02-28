<script lang="ts">
	interface Props {
		colspan?: number;
		isLoading?: boolean;
		loadingText?: string;
		noItemsText?: string;
	}

	let {
		colspan = 1,
		isLoading = false,
		loadingText = 'carregando',
		noItemsText = 'nenhum item encontrado'
	}: Props = $props();
</script>

<tr>
	<th class="p-4" {colspan}>
		{isLoading ? loadingText : noItemsText}
	</th>
</tr>
