<script>
	// TODO: rm me !
	import { xd } from '$lib/api/auth';
	import Navigation from '$lib/components/navigation/Navigation.svelte';
</script>

home page

<button class="button" on:click={() => xd()}> xd </button>

<Navigation />
