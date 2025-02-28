<script lang="ts">
	interface Props {
		date: Date | string;
	}

	let { date }: Props = $props();
</script>

<div class="text-sm">
	<p class="opacity-80">data de cadastro</p>
	{date instanceof Date ? date.toLocaleDateString() : new Date(date).toLocaleDateString()}
</div>
