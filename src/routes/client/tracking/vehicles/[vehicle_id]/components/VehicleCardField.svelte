<script lang="ts">
	export let label: string;

	let clazz = '';
	export { clazz as class };
</script>

<div class={clazz}>
	<div>{label}:</div>
	<b>
		<slot />
	</b>
</div>
