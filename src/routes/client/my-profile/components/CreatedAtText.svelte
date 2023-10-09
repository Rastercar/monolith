<script lang="ts">
	export let date: Date | string;
</script>

<div class="text-sm">
	<p class="opacity-80">created at</p>
	{date instanceof Date ? date.toLocaleDateString() : new Date(date).toLocaleDateString()}
</div>
