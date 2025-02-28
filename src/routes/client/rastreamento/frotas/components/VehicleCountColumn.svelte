<script lang="ts">
	const { count }: { count: number } = $props();
</script>

<div class="flex justify-center">
	<span class={`badge ${count > 0 ? 'preset-tonal-primary' : 'preset-tonal-secondary'} py-1 px-3`}>
		{count}
	</span>
</div>
