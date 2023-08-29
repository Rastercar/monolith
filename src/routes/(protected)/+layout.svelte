<script lang="ts">
	export let data;

	console.log('(protected) layout.svelte');
</script>

{data.sessionId}

<slot />
